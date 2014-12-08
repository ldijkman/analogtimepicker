// TODO(davidpeng): Make sure this works with IE8.

function AnalogTimePicker(element) {
  this.hour_ = 0;
  this.minute_ = 0;
  this.mode_ = 'hour';
  this.tapped_ = false;
  if (element.tagName == 'INPUT') {
    this.popup_ = document.createElement('div');
    this.popup_.className = 'analogtimepicker-popup';
    document.body.appendChild(this.popup_);
    this.container_ = document.createElement('div');
    this.popup_.appendChild(this.container_);
    this.setupContainer_();
    this.popup_.style.display = 'none';
    this.input_ = element;
    this.syncWithInput_();
  } else {
    this.container_ = element;
    this.setupContainer_();
  }
  this.addEventListeners_();
  this.tapped_ = false;
}

AnalogTimePicker.SEPARATOR = ':';
AnalogTimePicker.AM = 'AM';
AnalogTimePicker.PM = 'PM';

AnalogTimePicker.prototype.setupContainer_ = function() {
  this.container_.className += ' analogtimepicker-container';
  
  var textElement = document.createElement('div');
  textElement.className = 'analogtimepicker-text';
  this.container_.appendChild(textElement);
  
  this.hourElement_ = document.createElement('span');
  this.hourElement_.className = 'analogtimepicker-hour';
  this.hourElement_.textContent = this.getFormattedHour_(0);
  textElement.appendChild(this.hourElement_);
  this.hourElement_.style.width = this.hourElement_.offsetWidth + 'px';
  
  var separatorElement = document.createElement('span');
  separatorElement.className = 'analogtimepicker-separator';
  separatorElement.textContent = AnalogTimePicker.SEPARATOR;
  textElement.appendChild(separatorElement);
  
  this.minuteElement_ = document.createElement('span');
  this.minuteElement_.className = 'analogtimepicker-minute';
  this.minuteElement_.textContent = this.getFormattedMinute_(0);
  textElement.appendChild(this.minuteElement_);
  
  this.period_ = document.createElement('span');
  this.period_.className = 'analogtimepicker-period';
  this.period_.textContent = this.getFormattedPeriod_(0);
  textElement.appendChild(this.period_);
  
  this.clock_ = document.createElement('div');
  this.clock_.className = 'analogtimepicker-clock';
  this.container_.appendChild(this.clock_);
  
  var number = document.createElement('div');
  number.className = 'analogtimepicker-number';
  number.textContent = this.getFormattedMinute_(0);
  this.container_.appendChild(number);
  this.numberWidth_ = number.offsetWidth;
  this.clockCenter_ = this.clock_.offsetWidth / 2;
  this.numberRadius_ = this.clock_.offsetWidth / 2 - this.numberWidth_;
  this.container_.removeChild(number);
  
  var face = document.createElement('div');
  face.className = 'analogtimepicker-face';
  this.clock_.appendChild(face);
  face.style.height = face.offsetWidth + 'px';
  
  this.marker_ = document.createElement('div');
  this.marker_.className = 'analogtimepicker-marker';
  this.clock_.appendChild(this.marker_);
  this.positionClockElement_(this.marker_, 'hour', this.hour_);
  
  this.hours_ = [];
  for (var hour = 0; hour < 12; hour++) {
    number = document.createElement('div');
    number.className = 'analogtimepicker-number';
    number.textContent = this.getFormattedHour_(hour);
    this.clock_.appendChild(number);
    this.positionClockElement_(number, 'hour', hour);
    this.hours_.push(number);
  }
  
  this.minutes_ = [];
  for (var minute = 0; minute < 60; minute += 5) {
    number = document.createElement('div');
    number.className = 'analogtimepicker-number';
    number.textContent = this.getFormattedMinute_(minute);
    this.clock_.appendChild(number);
    this.positionClockElement_(number, 'minute', minute);
    this.minutes_.push(number);
  }
    
  this.am_ = document.createElement('div');
  this.am_.className = 'analogtimepicker-am';
  this.clock_.appendChild(this.am_);

  var amText = document.createElement('span');
  amText.className = 'analogtimepicker-periodtext';
  amText.textContent = AnalogTimePicker.AM;
  this.am_.appendChild(amText);
  amText.style.height = amText.offsetWidth + 'px';
  
  this.pm_ = document.createElement('div');
  this.pm_.className = 'analogtimepicker-pm';
  this.clock_.appendChild(this.pm_);
  
  var pmText = document.createElement('span');
  pmText.className = 'analogtimepicker-periodtext';
  pmText.textContent = AnalogTimePicker.PM;
  this.pm_.appendChild(pmText);
  pmText.style.height = pmText.offsetWidth + 'px';
  
  this.hover_ = document.createElement('div');
  this.hover_.className = 'analogtimepicker-hover';
  this.hover_.style.visibility = 'hidden';
  this.clock_.appendChild(this.hover_);
  
  this.refresh_();
};

AnalogTimePicker.prototype.refresh_ = function() {
  this.hourElement_.textContent = this.getFormattedHour_(this.hour_);
  this.hourElement_.className = 'analogtimepicker-hour';
  if (this.mode_ == 'hour') {
    this.hourElement_.className += ' analogtimepicker-active';
    this.positionClockElement_(this.marker_, 'hour', this.hour_);
  }
  
  this.minuteElement_.textContent = this.getFormattedMinute_(this.minute_);
  this.minuteElement_.className = 'analogtimepicker-minute';
  if (this.mode_ == 'minute') {
    this.minuteElement_.className += ' analogtimepicker-active';
    this.positionClockElement_(this.marker_, 'minute', this.minute_);
  }
  
  this.period_.textContent = this.getFormattedPeriod_(this.hour_);
  
  for (var i = 0; i < this.hours_.length; i++) {
    var hour = this.hours_[i];
    hour.style.visibility = this.mode_ == 'hour' ? 'visible' : 'hidden';
  }
  
  for (i = 0; i < this.minutes_.length; i++) {
    var minute = this.minutes_[i];
    minute.style.visibility = this.mode_ == 'minute' ? 'visible' : 'hidden';
  }
  
  this.am_.className = 'analogtimepicker-am';
  if (this.hour_ < 12) {
    this.am_.className += ' analogtimepicker-active';
  }
  
  this.pm_.className = 'analogtimepicker-pm';
  if (this.hour_ >= 12) {
    this.pm_.className += ' analogtimepicker-active';
  }
};

AnalogTimePicker.prototype.getFormattedHour_ = function(hour) {
  var formatted = hour % 12;
  return formatted === 0 ? 12 : formatted;
};

AnalogTimePicker.prototype.getFormattedMinute_ = function(minute) {
  return minute.toString().length == 1 ? '0' + minute : minute;
};

AnalogTimePicker.prototype.getFormattedPeriod_ = function(hour) {
  return hour < 12 ? AnalogTimePicker.AM : AnalogTimePicker.PM;
};

AnalogTimePicker.prototype.positionClockElement_ = function(elem, mode, pos) {
  var angle = pos / (mode == 'hour' ? 6 : 30) * Math.PI - Math.PI / 2;
  var x = this.numberRadius_ * Math.cos(angle);
  var y = this.numberRadius_ * Math.sin(angle);
  elem.style.left = this.clockCenter_ + x - elem.offsetWidth / 2 + 'px';
  elem.style.top = this.clockCenter_ + y - elem.offsetHeight / 2 + 'px';
};

AnalogTimePicker.prototype.addEventListeners_ = function() {
  var picker = this;
  
  picker.hourElement_.addEventListener('click', function() {
    picker.setMode('hour', true);
  });
  
  picker.minuteElement_.addEventListener('click', function() {
    picker.setMode('minute', true);
  });
  
  picker.period_.addEventListener('click', function() {
    picker.setHour((picker.hour_ + 12) % 24, true);
  });
  
  picker.clock_.addEventListener('mousemove', function(event) {
    picker.handleMouseMove_(picker.getClockPosition_(event));
  });
  
  picker.clock_.addEventListener('click', function(event) {
    picker.handleMouseUp_(picker.getClockPosition_(event));
  });
  
  picker.clock_.addEventListener('touchstart', function(event) {
    var position = picker.getClockPosition_(event.touches[0]);
    if (picker.mouseIsOverNumber_(position)) {
      event.preventDefault();
      picker.tapped_ = true;
      var touchEndListener = function(event) {
        document.removeEventListener('touchend', touchEndListener);
        var position = picker.getClockPosition_(event.changedTouches[0]);
        picker.handleMouseUp_(position);
        picker.tapped_ = false;
      };
      document.addEventListener('touchend', touchEndListener);
    }
  });
  
  picker.clock_.addEventListener('touchmove', function(event) {
    picker.tapped_ = false;
    picker.handleMouseMove_(picker.getClockPosition_(event.touches[0]));
  });
  
  picker.am_.addEventListener('click', function() {
    picker.setHour(picker.hour_ - 12, true);
  });
  
  picker.pm_.addEventListener('click', function() {
    picker.setHour(picker.hour_ + 12, true);
  });
  
  if (picker.input_) {
    var changeEvents = ['change', 'keyup', 'paste', 'input'];
    var changeListener = function() {
      picker.syncWithInput_();
    };
    for (var i = 0; i < changeEvents.length; i++) {
      picker.input_.addEventListener(changeEvents[i], changeListener);
    }
    
    picker.input_.addEventListener('click', function() {
      picker.showPopup_();
    });
  }
};

AnalogTimePicker.prototype.getClockPosition_ = function(event) {
  var rect = this.clock_.getBoundingClientRect();
  var clockX = rect.left + document.body.scrollLeft;
  var clockY = rect.top + document.body.scrollTop;
  var x = event.pageX - clockX - this.clockCenter_;
  var y = event.pageY - clockY - this.clockCenter_;
  return {
    radius: Math.sqrt(x * x + y * y),
    angle: Math.atan2(y, x) + Math.PI / 2
  };
};

AnalogTimePicker.prototype.handleMouseMove_ = function(position) {
  if (this.mouseIsOverNumber_(position)) {
    var value = this.getAngleValue_(position.angle);
    if (this.mode_ == 'hour') {
      this.hourElement_.textContent = this.getFormattedHour_(value);
      this.positionClockElement_(this.hover_, 'hour', value);
    } else {
      this.minuteElement_.textContent = this.getFormattedMinute_(value);
      this.positionClockElement_(this.hover_, 'minute', value);
    }
    this.hover_.style.visibility = 'visible';
    this.clock_.style.cursor = 'pointer';
  } else {
    this.refresh_();
    this.hover_.style.visibility = 'hidden';
    this.clock_.style.cursor = 'auto';
  }
};

AnalogTimePicker.prototype.handleMouseUp_ = function(position) {
  if (this.mouseIsOverNumber_(position)) {
    var value = this.getAngleValue_(position.angle);
    if (this.mode_ == 'hour') {
      this.setHour(Math.floor(this.hour_ / 12) * 12 + value, true);
      this.setMode('minute', true);
    } else {
      this.setMinute(value, true);
    }
    this.hover_.style.visibility = 'hidden';
  }
};

AnalogTimePicker.prototype.mouseIsOverNumber_ = function(position) {
  return Math.abs(position.radius - this.numberRadius_) < this.numberWidth_;
};

AnalogTimePicker.prototype.getAngleValue_ = function(angle) {
  if (this.mode_ == 'hour') {
    return (Math.round(angle * 6 / Math.PI) + 12) % 12;
  } else if (this.tapped_) {
    return (Math.round(angle * 6 / Math.PI) + 12) % 12 * 5;
  } else {
    return (Math.round(angle * 30 / Math.PI) + 60) % 60;
  }
};

AnalogTimePicker.prototype.showPopup_ = function() {
  var rect = this.input_.getBoundingClientRect();
  var inputX = rect.left + document.body.scrollLeft;
  var inputY = rect.top + document.body.scrollTop;
  this.popup_.style.left = inputX + 'px';
  this.popup_.style.top = inputY + this.input_.offsetHeight + 'px';
  this.popup_.style.display = 'block';
  
  var hidePopup = function(event) {
    if (!this.container_.contains(event.target)) {
      document.body.removeEventListener('click', hidePopup);
      this.popup_.style.display = 'none';
    }
  }.bind(this);
  document.body.addEventListener('click', hidePopup, true);
};

AnalogTimePicker.prototype.syncWithInput_ = function() {
  var pattern = new RegExp('^\\s*(0?[0-9]|1[0-2])\\' +
      AnalogTimePicker.SEPARATOR + '([0-5][0-9])\\s*(' + AnalogTimePicker.AM +
      '|' + AnalogTimePicker.PM + ')\\s*$', 'i');
  var match = pattern.exec(this.input_.value);
  if (match) {
    var hour = parseInt(match[1]);
    var minute = parseInt(match[2]);
    if (match[3].toLowerCase() == AnalogTimePicker.PM.toLowerCase()) {
      hour += 12;
    }
    if (hour != this.hour_ || minute != this.minute_) {
      this.setHour(hour, false, true);
      this.setMinute(minute, false, true);
      this.triggerEvent_('timechange');
    }
  }
};

AnalogTimePicker.prototype.setMode = function(mode, triggerEvent) {
  if (this.mode_ != mode && (mode == 'hour' || mode == 'minute')) {
    this.mode_ = mode;
    this.refresh_();
    if (triggerEvent) {
      this.triggerEvent_('modechange');
    }
  }
};

AnalogTimePicker.prototype.getMode = function() {
  return this.mode_;
};

AnalogTimePicker.prototype.setHour = function(hour, triggerEvent, leaveInput) {
  if (this.hour_ != hour && hour >= 0 && hour < 24) {
    this.hour_ = hour;
    this.refresh_();
    if (!leaveInput && this.input_) {
      this.updateInput_();
    }
    if (triggerEvent) {
      this.triggerEvent_('timechange');
    }
  }
};

AnalogTimePicker.prototype.getHour = function() {
  return this.hour_;
};

AnalogTimePicker.prototype.setMinute = function(minute, triggerEvent,
    leaveInput) {
  if (this.minute_ != minute && minute >= 0 && minute < 60) {
    this.minute_ = minute;
    this.refresh_();
    if (!leaveInput && this.input_) {
      this.updateInput_();
    }
    if (triggerEvent) {
      this.triggerEvent_('timechange');
    }
  }
};

AnalogTimePicker.prototype.getMinute = function() {
  return this.minute_;
};

AnalogTimePicker.prototype.triggerEvent_ = function(type) {
  var event = document.createEvent('Event');
  event.initEvent(type, true, true);
  this.container_.dispatchEvent(event);
};

AnalogTimePicker.prototype.updateInput_ = function() {
  var hour = this.getFormattedHour_(this.hour_);
  var minute = this.getFormattedMinute_(this.minute_);
  var period = this.getFormattedPeriod_(this.hour_);
  this.input_.value = hour + AnalogTimePicker.SEPARATOR + minute + ' ' + period;
};
