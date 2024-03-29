cordova.define("cordova-plugin-googlemaps.Polyline", function(require, exports, module) {
var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    common = require('./Common'),
    BaseClass = require('./BaseClass'),
    BaseArrayClass = require('./BaseArrayClass');

/*****************************************************************************
 * Polyline Class
 *****************************************************************************/
var Polyline = function(map, polylineId, polylineOptions) {
    BaseClass.apply(this);

    var self = this;
    Object.defineProperty(self, "map", {
        value: map,
        writable: false
    });
    Object.defineProperty(self, "id", {
        value: polylineId,
        writable: false
    });
    Object.defineProperty(self, "type", {
        value: "Polyline",
        writable: false
    });

    var pointsProperty = common.createMvcArray(polylineOptions.points);
    pointsProperty.on('set_at', function(index) {
        var value = common.getLatLng(pointsProperty.getAt(index));
        exec(null, self.errorHandler, self.getPluginName(), 'setPointAt', [polylineId, index, value]);
    });
    pointsProperty.on('insert_at', function(index) {
        var value = common.getLatLng(pointsProperty.getAt(index));
        exec(null, self.errorHandler, self.getPluginName(), 'insertPointAt', [polylineId, index, value]);
    });
    pointsProperty.on('remove_at', function(index) {
        exec(null, self.errorHandler, self.getPluginName(), 'removePointAt', [polylineId, index]);
    });

    Object.defineProperty(self, "points", {
        value: pointsProperty,
        writable: false
    });
    //-----------------------------------------------
    // Sets the initialize option to each property
    //-----------------------------------------------
    var ignores = ["map", "id", "hashCode", "type", "points"];
    for (var key in polylineOptions) {
        if (ignores.indexOf(key) === -1) {
            self.set(key, polylineOptions[key]);
        }
    }

    //-----------------------------------------------
    // Sets event listeners
    //-----------------------------------------------
    self.on("geodesic_changed", function(oldValue, geodesic) {
        exec(null, self.errorHandler, self.getPluginName(), 'setGeodesic', [self.getId(), geodesic]);
    });
    self.on("zIndex_changed", function(oldValue, zIndex) {
        exec(null, self.errorHandler, self.getPluginName(), 'setZIndex', [self.getId(), zIndex]);
    });
    self.on("clickable_changed", function(oldValue, clickable) {
        exec(null, self.errorHandler, self.getPluginName(), 'setClickable', [self.getId(), clickable]);
    });
    self.on("visible_changed", function(oldValue, visible) {
        exec(null, self.errorHandler, self.getPluginName(), 'setVisible', [self.getId(), visible]);
    });
    self.on("strokeWidth_changed", function(oldValue, width) {
        exec(null, self.errorHandler, self.getPluginName(), 'setStrokeWidth', [self.getId(), width]);
    });
    self.on("strokeColor_changed", function(oldValue, color) {
        exec(null, self.errorHandler, self.getPluginName(), 'setStrokeColor', [self.getId(), common.HTMLColor2RGBA(color, 0.75)]);
    });

};

utils.extend(Polyline, BaseClass);

Polyline.prototype.getId = function() {
    return this.id;
};

Polyline.prototype.getPluginName = function() {
    return this.map.getId() + "-polyline";
};

Polyline.prototype.getHashCode = function() {
    return this.hashCode;
};

Polyline.prototype.setPoints = function(points) {
    var mvcArray = this.points;
    mvcArray.empty();

    var i,
        path = [];

    for (i = 0; i < points.length; i++) {
        mvcArray.push({
            "lat": points[i].lat,
            "lng": points[i].lng
        });
    }
    return this;
};
Polyline.prototype.getPoints = function() {
    return this.points;
};
Polyline.prototype.setStrokeColor = function(color) {
    this.set('strokeColor', color);
    return this;
};
Polyline.prototype.getStrokeColor = function() {
    return this.get('strokeColor');
};
Polyline.prototype.setStrokeWidth = function(width) {
    this.set('strokeWidth', width);
    return this;
};
Polyline.prototype.getStrokeWidth = function() {
    return this.get('strokeWidth');
};
Polyline.prototype.setVisible = function(visible) {
    visible = common.parseBoolean(visible);
    this.set('visible', visible);
    return this;
};
Polyline.prototype.getVisible = function() {
    return this.get('visible');
};
Polyline.prototype.setClickable = function(clickable) {
    clickable = common.parseBoolean(clickable);
    this.set('clickable', clickable);
    return this;
};
Polyline.prototype.getClickable = function() {
    return this.get('clickable');
};
Polyline.prototype.setGeodesic = function(geodesic) {
    geodesic = common.parseBoolean(geodesic);
    this.set('geodesic', geodesic);
    return this;
};
Polyline.prototype.getGeodesic = function() {
    return this.get('geodesic');
};
Polyline.prototype.setZIndex = function(zIndex) {
    this.set('zIndex', zIndex);
    return this;
};
Polyline.prototype.getZIndex = function() {
    return this.get('zIndex');
};

Polyline.prototype.getMap = function() {
    return this.map;
};

Polyline.prototype.remove = function() {
    exec(null, this.errorHandler, this.getPluginName(), 'remove', [this.getId()]);
    this.trigger(this.id + "_remove");
    var points = this.get("points");
    if (points) {
      points.clear();
    }
    this.off();
};
module.exports = Polyline;

});
