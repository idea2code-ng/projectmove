const sequelize = require("../models/sequelize/index")

const loadercity = () => {

      // something to keep in mind
  // we have to find pickup and dropoff location cities
  // based on these cities we have to sort drivers and loaders for pickup and dropoff
  // we will fetch drivers and loader according to city received in req.body.

    const loadersInOrderCity = await sequelize.models.Loaders.findAll({
        where: {
            city: ctrlData.city,
        },
    });
    //const checkmileDriver = checkmile.filter(data => { return data >100 })

    let loaderMap = {}
    let loaderdistance = ""
    const loaderiatlog = loadersInOrderCity.forEach((loader, index) => {
        loaderMap[`${index}`] = { id: loader.Id, rating: loader.rating }
        const LatestString = `${loader.latitude},${loader.longitude}`
        if (loaderdistance == "") {
            loaderdistance = LatestString
        } else {
            loaderdistance = `${loaderdistance}|${LatestString}`
        }
    });

    var loaderaddress = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${ctrlData.pickuplat},${ctrlData.pickuplong}&destinations=${loaderdistance}&key=AIzaSyDNHQHj_x4yh6GOdNiiPZmc2BjZUMEnJHQ`,
        headers: {}
    };
    // we will make distance matrix api call with pick location to all the drievrs and same for loaders

    let pickuploaders = []
    await axios(loaderaddress)
        .then(async (response) => {
            response.data.rows[0].elements.map((item, index) => {
                const currentDriverIddriverMap = loaderMap[`${index}`]
                const pickuploadermile = item.distance.text.split(" ")[0].replace(/\,/g, '') * 0.62
                if (pickuploadermile < 100) {
                    pickuploaders = [...pickuploaders, { loaderId: currentDriverIddriverMap, location: item, rating: loaderMap[`${index}`].rating }]
                }
            })
        })
        .catch(function (error) {
            console.log(error);
        });

    pickuploaders.map(async (data) => {
        const now = new Date().toLocaleTimeString()
        var theFutureTime = moment().add(30, 'minutes').format(" HH:mm a");
        const Eligibledloader = await sequelize.models.Eligible_loaders.create({
            response: "Pending",
            order_id: order_id,
            loader_id: data.loaderId,
            visibility: data.rating > 1 ? now : theFutureTime
        });
    })

    let loaderdroffmap = {}
    let loaderdroffdistance = ""
    const loaderdroffdist = loadersInOrderCity.forEach((loader, index) => {
        loaderdroffmap[`${index}`] = { id: loader.Id, rating: loader.rating };
        const LatestString = `${loader.latitude},${loader.longitude}`
        if (loaderdroffdistance == "") {
            loaderdroffdistance = LatestString
        } else {
            loaderdroffdistance = `${loaderdroffdistance}|${LatestString}`
        }
    });

    var loaderdroffaddress = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${ctrlData.dropofflat},${ctrlData.dropofflong}&destinations=${loaderdroffdistance}&key=AIzaSyDNHQHj_x4yh6GOdNiiPZmc2BjZUMEnJHQ`,
        headers: {}
    };
    // we will make distance matrix api call with pick location to all the drievrs and same for loaders

    let dropoffloaders = []
    await axios(loaderdroffaddress)
        .then(async (response) => {
            response.data.rows[0].elements.map((item, index) => {
                const currentloaderId = loaderdroffmap[`${index}`]
                const pickuploadermile = item.distance.text.split(" ")[0].replace(/\,/g, '') * 0.62
                if (pickuploadermile < 100) {
                    dropoffloaders = [...dropoffloaders, { loaderId: currentloaderId, location: item, rating: loaderdroffmap[`${index}`].rating }]
                }
            })
        })
        .catch(function (error) {
            console.log(error);
        });

    dropoffloaders.map(async (data) => {
        const now = new Date().toLocaleTimeString()
        var theFutureTime = moment().add(30, 'minutes').format(" HH:mm a");
        const Eligibledloader = await sequelize.models.Eligible_loaders.create({
            response: "Pending",
            order_id: order_id,
            loader_id: data.loaderId,
            visibility: data.rating > 1 ? now : theFutureTime
        });
    })


}
module.exports = { loadercity }