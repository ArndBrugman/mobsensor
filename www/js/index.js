 /*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    watchLocationID : 0,
    watchAccelerationID : 0,
    watchCompassID : 0,
    
    // Application Constructor
    initialize: function() {
        app.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      if (window.cordova) {
        document.addEventListener('deviceready', app.onDeviceReady, false);
        document.addEventListener('pause', app.onPause, false);
        document.addEventListener('resume', app.onResume, false);
      } else app.onDeviceReady();
    },
    // deviceready Event Handler
    //
    onDeviceReady: function() {
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        app.onStart();
    },
    onStart: function() {
        if (navigator.geolocation)
          app.watchLocationID = navigator.geolocation.watchPosition(app.onLocation, app.onLocationError, { timeout: 30000 }); // Max Timeout = 30 seconds
        else document.getElementById('location').innerHTML = 'Location not Supported';
        if (navigator.compass)
          app.watchCompassID = navigator.compass.watchHeading(app.onCompass, app.onCompassError, { frequency: 50 }); // Update 50 times per seconds
        else document.getElementById('compass').innerHTML = 'Compass not Supported';
        if (navigator.accelerometer)
          app.watchAccelerationID = navigator.accelerometer.watchAcceleration(app.onAcceleration, app.onAccelerationError, { frequency: 50 }); // Update 50 times per seconds
        else document.getElementById('accel').innerHTML = "Accelerometer not Supported";
        window.addEventListener("batterystatus", app.onBatteryStatus, false);
    },
    onPause: function() {
        if (navigator.geolocation)
            navigator.geolocation.clearWatch(app.watchLocationID);
        app.watchLocationID = 0;
        if (navigator.compass)
            navigator.compass.clearWatch(app.watchCompassID);
        app.watchCompassID = 0;
        if (navigator.accelerometer)
            navigator.accelerometer.clearWatch(app.watchAccelerationID);
        app.watchAccelerationID = 0;
    },
    onResume: function() {
      document.getElementById('status').innerHTML = 'Resume';  
      app.onStart();
    },
    onLocation: function(position) {
        document.getElementById('location').innerHTML = 'Latitude: ' + position.coords.latitude.toFixed(4) + '<br />' +
         'Longitude: ' + position.coords.longitude.toFixed(4);
    },
    onLocationError: function(error) {
        document.getElementById('location').innerHTML = 'Location error: ' + error.code + '<br />' +
         'message: ' + error.message;
        navigator.geolocation.clearWatch(watchLocationID);
        watchLocationID = 0;
    },
    onCompass: function(heading) {
        document.getElementById('compass').innerHTML = 'Heading: ' + heading.magneticHeading.toFixed(1);
    },
    onCompassError: function(compassError) {
        document.getElementById('compass').innerHTML = 'Compass error: ' + compassError.code;
        navigator.compass.clearWatch(watchCompassID);
        watchCompassID = 0;
    },
    onBatteryStatus: function(info) {
        document.getElementById('battery').innerHTML = "Level: " + info.level + "<br /> isPlugged: " + info.isPlugged;
    },
    onAcceleration: function(acceleration) {
        document.getElementById('accel').innerHTML = 'Acceleration X: ' + acceleration.x.toFixed(3) + '<br />' +
          'Acceleration Y: ' + acceleration.y.toFixed(3) + '<br />' +
          'Acceleration Z: ' + acceleration.z.toFixed(3) + '<br />' +
          'Timestamp: '      + acceleration.timestamp;
    },
    onAccelerationError: function() {
        document.getElementById('accel').innerHTML = "Accelerometer error";
        navigator.accelerometer.clearWatch(watchAccelerationID);
        watchAccelerationID = 0;
    }

};

app.initialize();
