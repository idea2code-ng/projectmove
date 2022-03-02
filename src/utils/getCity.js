const axios = require("axios");

const getCityFromLatLong = async (lat, long) => {
  try {
    let city = null;
    if (!lat || !long) {
      throw new Error("Please provide valid information to find city");
    }
    const respickup = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}%2C${long}&result_type=administrative_area_level_2&result_type=locality&key=AIzaSyDNHQHj_x4yh6GOdNiiPZmc2BjZUMEnJHQ`
    );
    respickup.data.results[0].address_components.map((item) => {
      if (item.types.includes("administrative_area_level_2")) {
        city = item.short_name;
      }
    });
    return city;
  } catch (error) {
    throw error;
  }
};

module.exports = { getCityFromLatLong };
