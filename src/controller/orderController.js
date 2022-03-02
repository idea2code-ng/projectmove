const sequelize = require("../models/sequelize/index");
const { findModelItemsQ, findModelItemQ } = require("../queries/generic");
const { DataNotFoundError } = require("../errors");
var axios = require("axios");
const { Op } = require("sequelize");
const luxon = require("luxon");
const { orderdriverpickupcity, orderdriverdropoffcity } = require("../utils/orderdriverUtils");
const { orderloaderpickupcity, orderloaderdropoffcity } = require("../utils/orderloaderUtils");
const { getCityFromLatLong } = require("../utils/getCity");
const getorderController = async (userId) => {
  try {
    let responseData = [];
    let orders = await findModelItemsQ("Orders", {
      where: {
        user_id: userId,
      },
      attributes: ["Id", "date", "time", "weight", "order_id", "pickup", "dropoff"],
      include: [
        {
          model: sequelize.models.Users,
          attributes: ["Id", "username", "profilePic"],
        },
        {
          model: sequelize.models.Fleets,
          attributes: ["image"],
        },
      ],
    });
    await Promise.all(
      orders.rows.map(async (order) => {
        let prepareObj = { ...order.dataValues };
        const currentOrderDetails = await sequelize.models.Order_details.findOne({
          where: { order_id: order.order_id },
          attributes: ["distance", "total_price", "transport_price"],
        });
        const { distance, total_price, transport_price } = currentOrderDetails;
        prepareObj = { ...prepareObj, distance, total_price, transport_price };
        responseData.push(prepareObj);
      })
    );
    return responseData;
  } catch (error) {
    throw error;
  }
};

const addorderctrl = async (ctrlData, userData) => {
  // we will create order entry in Orders table
  try {
    const pickUpCity = await getCityFromLatLong(ctrlData.pickuplat, ctrlData.pickuplong);
    const dropOffCity = await getCityFromLatLong(ctrlData.dropofflat, ctrlData.dropofflong);
    let generateNewOrderId = true;
    let order_id;
    while (generateNewOrderId) {
      order_id = Math.floor(100000 + Math.random() * 900000);
      const order = await sequelize.models.Orders.findOne({
        where: {
          order_id: order_id,
        },
      });
      if (!order) {
        generateNewOrderId = false;
      }
    }
    const order = await sequelize.models.Orders.create({
      ...ctrlData,
      pickup_city: pickUpCity,
      dropoff_city: dropOffCity,
      user_id: userData,
      order_id: order_id,
      foundloader: 0,
      foundunloader: 0,
    });

    // we will fetch fleet according to fleet id received in req
    const fleet = await findModelItemQ("Fleets", { where: { Id: ctrlData.fleet_id } });
    if (!fleet) {
      throw new DataNotFoundError("fleet does not exit");
    }

    // we will find distance betwenn pickup and dropoff location with distance matrix api
    // we will use price ($/mile) of that fleet in calculating transport price
    var config = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${ctrlData.pickuplat},${ctrlData.pickuplong}&destinations=${ctrlData.dropofflat},${ctrlData.dropofflong}&key=AIzaSyDNHQHj_x4yh6GOdNiiPZmc2BjZUMEnJHQ`,
      headers: {},
    };

    const response = await axios(config);

    const durationtime = response.data.rows[0].elements[0].duration.text;
    const distance = response.data.rows[0].elements[0].distance.text;
    // we will convert price into km or mile
    const transport_price =
      (parseFloat(response.data.rows[0].elements[0].distance.text.split(" ")[0]) * fleet.price) / 1.60934;
    await sequelize.models.Order_details.create({
      ...ctrlData,
      distance: distance,
      transport_price: parseFloat(transport_price, 10),
      transportation_time: durationtime,
      order_id: order_id,
    });

    // we have to find pickup and dropoff location cities
    // based on these cities we have to sort drivers and loaders for pickup and dropoff
    // we will fetch drivers and loader according to city received in req.body.
    // find drivers around pickup location  --> 100 mile
    await orderdriverpickupcity(ctrlData.pickuplat, ctrlData.pickuplong, order_id, pickUpCity);
    // find drivers around dropoff location
    // orderdriverdropoffcity(ctrlData.city, ctrlData.dropofflat, ctrlData.dropofflong, order_id)
    // find loaders around pickup location
    await orderloaderpickupcity(ctrlData.pickuplat, ctrlData.pickuplong, order_id, pickUpCity);
    // find loaders around dropoff location
    await orderloaderdropoffcity(ctrlData.dropofflat, ctrlData.dropofflong, order_id, dropOffCity);
    // we will make distance matrix api call with drop location to all the drievrs and same for loaders
    return { order };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getorderController,
  addorderctrl,
};
