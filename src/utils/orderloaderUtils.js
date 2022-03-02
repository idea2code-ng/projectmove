const sequelize = require("../models/sequelize/index");
const moment = require("moment");
const axios = require("axios");

const orderloaderpickupcity = async (pickuplat, pickuplong, order_id, city) => {
  try {
    const loadersInOrderCity = await sequelize.models.Loaders.findAll({
      where: {
        city: city,
      },
    });
    //const checkmileDriver = checkmile.filter(data => { return data >100 })

    let loaderMap = {};
    let loaderdistance = "";
    loadersInOrderCity.forEach((loader, index) => {
      loaderMap[`${index}`] = { id: loader.Id, rating: loader.rating };
      const LatestString = `${loader.latitude},${loader.longitude}`;
      if (loaderdistance == "") {
        loaderdistance = LatestString;
      } else {
        loaderdistance = `${loaderdistance}|${LatestString}`;
      }
    });

    var loaderaddress = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickuplat},${pickuplong}&destinations=${loaderdistance}&key=AIzaSyDNHQHj_x4yh6GOdNiiPZmc2BjZUMEnJHQ`,
      headers: {},
    };
    // we will make distance matrix api call with pick location to all the drievrs and same for loaders

    let pickuploaders = [];
    const response = await axios(loaderaddress);

    response.data.rows[0].elements.map((item, index) => {
      const currentDriverIddriverMap = loaderMap[`${index}`];
      const pickuploadermile = item.distance.text.split(" ")[0].replace(/\,/g, "") * 0.62;
      if (pickuploadermile < 100) {
        pickuploaders = [
          ...pickuploaders,
          { loaderId: currentDriverIddriverMap, location: item, rating: loaderMap[`${index}`].rating },
        ];
      }
    });

    await Promise.all(
      pickuploaders.map(async (data) => {
        const now = new Date().toLocaleTimeString();
        var theFutureTime = moment().add(30, "minutes").format("hh:mm:ss a");
        await sequelize.models.Eligible_loaders.create({
          response: "Pending",
          order_id: order_id,
          loader_id: data.loaderId.id,
          visibility: data.rating >= 4 ? now : theFutureTime,
          purpose: 1,
        });
      })
    );
  } catch (error) {
    throw error;
  }
};

const orderloaderdropoffcity = async (dropofflat, dropofflong, order_id, city) => {
  try {
    const loadersInOrderCity = await sequelize.models.Loaders.findAll({
      where: {
        city: city,
      },
    });

    let loaderdroffmap = {};
    let loaderdroffdistance = "";
    loadersInOrderCity.forEach((loader, index) => {
      loaderdroffmap[`${index}`] = { id: loader.Id, rating: loader.rating };
      const LatestString = `${loader.latitude},${loader.longitude}`;
      if (loaderdroffdistance == "") {
        loaderdroffdistance = LatestString;
      } else {
        loaderdroffdistance = `${loaderdroffdistance}|${LatestString}`;
      }
    });

    var loaderdroffaddress = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${dropofflat},${dropofflong}&destinations=${loaderdroffdistance}&key=AIzaSyDNHQHj_x4yh6GOdNiiPZmc2BjZUMEnJHQ`,
      headers: {},
    };
    // we will make distance matrix api call with pick location to all the drievrs and same for loaders

    let dropoffloaders = [];
    const response = await axios(loaderdroffaddress);
    response.data.rows[0].elements.map((item, index) => {
      const currentloaderId = loaderdroffmap[`${index}`];
      const pickuploadermile = item.distance.text.split(" ")[0].replace(/\,/g, "") * 0.62;
      if (pickuploadermile < 100) {
        dropoffloaders = [
          ...dropoffloaders,
          { loaderId: currentloaderId, location: item, rating: loaderdroffmap[`${index}`].rating },
        ];
      }
    });

    await Promise.all(
      dropoffloaders.map(async (data) => {
        const now = new Date().toLocaleTimeString();
        var theFutureTime = moment().add(30, "minutes").format("hh:mm:ss a");
        const Eligibledloader = await sequelize.models.Eligible_loaders.create({
          response: "Pending",
          order_id: order_id,
          loader_id: data.loaderId.id,
          visibility: data.rating >= 4 ? now : theFutureTime,
          purpose: 2,
        });
      })
    );
  } catch (error) {
    throw error;
  }
};

module.exports = { orderloaderpickupcity, orderloaderdropoffcity };
