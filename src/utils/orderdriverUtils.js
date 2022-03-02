const sequelize = require("../models/sequelize/index");
const moment = require("moment");
const axios = require("axios");
const orderdriverpickupcity = async (pickuplat, pickuplong, order_id, city) => {
  // we will fetch drivers and loader according to city received in req.body.
  try {
    const driversInOrderCity = await sequelize.models.Drivers.findAll({
      where: {
        city: city,
      },
    });
    let driverMap = {};
    let driversDestinations = "";
    driversInOrderCity.forEach((driver, index) => {
      driverMap[`${index}`] = { id: driver.Id, rating: driver.rating };
      const currentDriverLatLong = `${driver.latitude},${driver.longitude}`;
      if (driversDestinations == "") {
        driversDestinations = currentDriverLatLong;
      } else {
        driversDestinations = `${driversDestinations}|${currentDriverLatLong}`;
      }
    });

    // await findPickupDrivers()  --> return all the eligible drivers for pickup location
    var PickupDriverRequest = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickuplat},${pickuplong}&destinations=${driversDestinations}&key=AIzaSyDNHQHj_x4yh6GOdNiiPZmc2BjZUMEnJHQ`,
      headers: {},
    };
    // we will make distance matrix api call with pick location to all the drievrs and same for loaders

    let pickupDrivers = [];
    const response = await axios(PickupDriverRequest);
    response.data.rows[0].elements.map((driver, index) => {
      const currentDriverIddriverMap = driverMap[`${index}`].id;
      const pickdrivermile = driver.distance.text.split(" ")[0].replace(/\,/g, "") * 0.62;
      if (pickdrivermile < 100) {
        pickupDrivers = [
          ...pickupDrivers,
          { driverId: currentDriverIddriverMap, location: driver, rating: driverMap[`${index}`].rating },
        ];
      }
    });

    // creating entries for pickup drivers in eligible drivers table
    await Promise.all(
      pickupDrivers.map(async (data) => {
        const now = new Date().toLocaleTimeString();
        var theFutureTime = moment().add(30, "minutes").format("hh:mm:ss a");
        await sequelize.models.Eligible_drivers.create({
          response: "Pending",
          order_id: order_id,
          driver_id: data.driverId,
          visibility: parseFloat(data.rating) >= 4 ? now : theFutureTime,
        });
      })
    );
  } catch (error) {
    throw error;
  }
};

const orderdriverdropoffcity = async (city, dropofflat, dropofflong, order_id) => {
  const driversInOrderCity = await sequelize.models.Drivers.findAll({
    where: {
      city: city,
    },
  });

  let driverdropoffMap = {};
  let driverdropoffdistance = "";
  driversInOrderCity.forEach((driver, index) => {
    driverdropoffMap[`${index}`] = { id: driver.Id, rating: driver.rating };
    const currentdriverlogitute = `${driver.latitude},${driver.longitude}`;
    if (driverdropoffdistance == "") {
      driverdropoffdistance = currentdriverlogitute;
    } else {
      driverdropoffdistance = `${driverdropoffdistance}|${currentdriverlogitute}`;
    }
  });

  var driverdropoffaddress = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${dropofflat},${dropofflong}&destinations=${driverdropoffdistance}&key=AIzaSyDNHQHj_x4yh6GOdNiiPZmc2BjZUMEnJHQ`,
    headers: {},
  };
  // we will make distance matrix api call with pick location to all the drievrs and same for loaders

  let DrofofDrivers = [];
  const response = await axios(driverdropoffaddress);
  response.data.rows[0].elements.map((item, index) => {
    const currentDriverdropoff = driverdropoffMap[`${index}`];
    const dropoffdrivermile = item.distance.text.split(" ")[0].replace(/\,/g, "") * 0.62;
    if (dropoffdrivermile < 100) {
      DrofofDrivers = [
        ...DrofofDrivers,
        { driverId: currentDriverdropoff, location: item, rating: driverdropoffMap[`${index}`].rating },
      ];
    }
  });

  await Promise.all(
    DrofofDrivers.map(async (data) => {
      const now = new Date().toLocaleTimeString();
      var theFutureTime = moment().add(30, "minutes").format("hh:mm:ss a");
      await sequelize.models.Eligible_drivers.create({
        response: "Pending",
        order_id: order_id,
        driver_id: data.driverId.id,
        visibility: data.rating >= 4 ? now : theFutureTime,
      });
    })
  );
};
module.exports = { orderdriverpickupcity, orderdriverdropoffcity };
