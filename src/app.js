'use strict';
var AccelerometerHelper, BackgroundLayer, DisplayHelper, EventsUtils, HexUtils, KeyboardHelper, MouseHelper, ObjectsUtils, RESOLUTIONS, StartupScene, TouchHelper, g_resources, i, res;

AccelerometerHelper = function() {
  return {
    isAccelerometerExist: function() {
      return cc.sys.capabilities.hasOwnProperty('accelerometer');
    },
    enabledAccelerometer: function() {
      return cc.inputManager.setAccelerometerEnabled(true);
    },
    disabledAccelerometer: function() {
      return cc.inputManager.setAccelerometerEnabled(false);
    },
    isAccelerometerEnabled: function() {
      return cc.Device.isAccelerometerEnabled;
    },
    addAccelerometerListener: function() {
      return cc.eventManager.addListener({
        event: cc.EventListener.ACCELERATION,
        callback: function(acc, event) {
          return cc.log("Accelerometer feel smth!");
        }
      }, this);
    }
  };
};

'use strict';

RESOLUTIONS = {
  iPadRetina: {
    large: 2048,
    small: 1536
  },
  iPad: {
    large: 1024,
    small: 768
  },
  iPhoneSixPlus: {
    large: 2208,
    small: 1242
  },
  iPhoneSix: {
    large: 1334,
    small: 750
  },
  iPhoneFive: {
    large: 1136,
    small: 640
  }
};

DisplayHelper = function() {
  return {
    isNative: cc.sys.isNative,
    searchPaths: jsb.fileUtils.getSearchPaths(),
    displayWidth: cc.view.getFrameSize().width,
    displayHeight: cc.view.getFrameSize().height,
    isResolution: function(width, height) {
      return (this.width === width) && (this.height === height);
    },
    isIPadRetina: function() {
      var isLandscape, isPortrait;
      isPortrait = this.isResolution(RESOLUTIONS.iPadRetina.large(RESOLUTIONS.iPadRetina.small));
      isLandscape = this.isResolution(RESOLUTIONS.iPadRetina.small(RESOLUTIONS.iPadRetina.large));
      return (isPortrait || isLandscape) && this.isNative;
    },
    iPad: function() {
      var isLandscape, isPortrait;
      isPortrait = this.isResolution(RESOLUTIONS.iPad.large(RESOLUTIONS.iPad.small));
      isLandscape = this.isResolution(RESOLUTIONS.iPad.small(RESOLUTIONS.iPad.large));
      return (isPortrait || isLandscape) && this.isNative;
    },
    iPhoneSixPlus: function() {
      var isLandscape, isPortrait;
      isPortrait = this.isResolution(RESOLUTIONS.iPhoneSixPlus.large(RESOLUTIONS.iPhoneSixPlus.small));
      isLandscape = this.isResolution(RESOLUTIONS.iPhoneSixPlus.small(RESOLUTIONS.iPhoneSixPlus.large));
      return (isPortrait || isLandscape) && this.isNative;
    },
    iPhoneSix: function() {
      var isLandscape, isPortrait;
      isPortrait = this.isResolution(RESOLUTIONS.iPhoneSix.large(RESOLUTIONS.iPhoneSix.small));
      isLandscape = this.isResolution(RESOLUTIONS.iPhoneSix.small(RESOLUTIONS.iPhoneSix.large));
      return (isPortrait || isLandscape) && this.isNative;
    },
    iPhoneFive: function() {
      var isLandscape, isPortrait;
      isPortrait = this.isResolution(RESOLUTIONS.iPhoneFive.large(RESOLUTIONS.iPhoneFive.small));
      isLandscape = this.isResolution(RESOLUTIONS.iPhoneFive.small(RESOLUTIONS.iPhoneFive.large));
      return (isPortrait || isLandscape) && this.isNative;
    },
    isLandscape: function() {},
    isPortrait: function() {
      return !this.isLandscape();
    }
  };
};

'use strict';

EventsUtils = function() {
  return {
    listeners: [],
    addListener: function(listenerConfig) {
      return cc.eventManager.addListener(listenerConfig);
    },
    removeAllListeners: function() {
      return cc.eventManager.removeAllListeners();
    },
    removeListener: function(listener) {
      return cc.eventManager.removeListener(listener);
    },
    removeListenersForObject: function(object) {
      return cc.eventManager.removeListeners(object);
    },
    removeListenersByType: function(type) {
      return cc.eventManager.removeListeners(type);
    },
    pause: function(layer, isRecursive) {
      return cc.eventManager.pauseTarget(layer, isRecursive);
    },
    resume: function(layer, isRecursive) {
      return cc.eventManager.resumeTarget(layer, isRecursive);
    }
  };
};

'use strict';

HexUtils = function() {
  return {
    hexes: {},
    hexesConfig: {
      type: 'Pointy topped',
      cornersCount: 6
    },
    setHexesConfig: function(size) {
      this.hexesConfig.hexSize = size;
      this.hexesConfig.hexHeight = size * 2;
      this.hexesConfig.hexWidth = Math.sqrt(3) / 2 * this.hexesConfig.hexHeight;
      return this.hexesConfig.horizontalDistance = this.hexesConfig.hexWidth;
    },
    addHex: function(centerX, centerY) {
      var angle, hex, i, x_i, y_i, _i, _ref;
      hex = {
        centerX: centerX,
        centerY: centerY
      };
      for (i = _i = 0, _ref = this.hexesConfig.cornersCount; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        angle = 2 * Math.PI / this.hexesConfig.cornersCount * (i + 0.5);
        x_i = centerX + this.hexesConfig.hexSize * Math.cos(angle);
        y_i = centerY + this.hexesConfig.hexSize * Math.sin(angle);
        if (i === 0) {
          cc.log("moved x: " + x_i + ", y: " + y_i);
        } else {
          cc.log("drew the line x: " + x_i + ", y: " + y_i);
        }
      }
      hex.id = ObjectsUtils.getCustomPostfixId("" + (Math.floor(centerX)) + "-" + (Math.floor(centerY)));
      this.hexes[hex.id] = hex;
      return hex;
    },
    generateHexes: function(centerX, centerY, count) {
      var hex, i, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
        _results.push(hex = this.addHex(centerX, centerY));
      }
      return _results;
    }
  };
};

'use strict';

KeyboardHelper = function() {
  return {
    isKeyboardExist: function() {
      return cc.sys.capabilities.hasOwnProperty('keyboard');
    },
    getCurrentTarget: function(event) {
      return event.getCurrentTarget();
    },
    addKeyboardListener: function() {
      return cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed: function(keyCode, event) {
          var label;
          label = event.getCurrentTarget();
          return label.setString("Key " + (keyCode.toString()) + " was pressed!");
        },
        onKeyReleased: function(keyCode, event) {
          var label;
          label = event.getCurrentTarget();
          return label.setString("Key " + (keyCode.toString()) + " was relesed!");
        }
      }, this);
    }
  };
};

'use strict';

BackgroundLayer = cc.Layer.extend({
  demoLvlMap: null,
  map01: null,
  mapWidth: 0,
  mapIndex: 0,
  ctor: function() {
    this._super();
    return this.init();
  },
  init: function() {
    this._super();
    this.demoLvlMap = cc.TMXTiledMap.create(res.demo_lvl_bg_tmx);
    this.addChild(this.demoLvlMap);
    this.mapWidth = this.demoLvlMap.getContentSize().width;
    return this.scheduleUpdate();
  }
});


/*AnimationLayer = cc.Layer.extend
    spriteSheet: null
    runningAction: null
    sprite: null
    ctor: ->
        @_super()
        @init()

    init: ->
        @_super()

        cc.spriteFrameCache.addSpriteFrames res.running_plist #TODO (S.Panfilov) second arg
        @spriteSheet = cc.SpriteBatchNode.create res.running_png
        @addChild @spriteSheet

        animFrames = []
        for i in [0..7]
            str = "runner" + i + ".png"
            frame = cc.spriteFrameCache.getSpriteFrame str
            animFrames.push frame

        animation = cc.Animation.create animFrames, 0.1
        @runningAction = cc.RepeatForever.create cc.Animate.create animation
        @sprite = cc.Sprite.create "#runner0.png"
        @sprite.attr
            x:80
            y:85
        @sprite.runAction
    @runningAction;
        @spriteSheet.addChild @sprite;
 */

StartupScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    this.addChild(new BackgroundLayer());
  }
});

'use strict';

MouseHelper = function() {
  return {
    isMouseExist: function() {
      return cc.sys.capabilities.hasOwnProperty('mouse');
    },
    addMouseListener: function() {
      return cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseDown: function(event) {
          if (event.getButton() === cc.EventMouse.BUTTON_LEFT) {
            return cc.log("Left mouse button pressed at " + (event.getLocationX()));
          }
        },
        onMouseUp: function(event) {
          if (event.getButton() === cc.EventMouse.BUTTON_LEFT) {
            return cc.log("Left mouse button released at " + (event.getLocationX()));
          }
        }
      }, this);
    },
    onLeftMouseDown: function() {},
    onLeftMouseUp: function() {},
    onMouseScroll: function() {},
    onLeftMouseClicked: function() {},
    onLeftMouseDoubleClicked: function() {}
  };
};

'use strict';

ObjectsUtils = function() {
  return {
    getS4: function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    },
    getRandomId: function() {
      return "" + (this.getS4()) + (this.getS4()) + "-" + (this.getS4()) + "-" + (this.getS4()) + "-" + (this.getS4()) + "-" + (this.getS4()) + (this.getS4()) + (this.getS4());
    },
    getCustomPostfixId: function(postfix) {
      return "" + (this.getRandomId()) + "_#postfix";
    }
  };
};

'use strict';

res = {
  sprite_png: "res/sprite.png",
  sprite_plist: "res/sprite.plist",
  running_png: "res/running.png",
  running_plist: "res/running.plist",
  demo_lvl_bg_png: "res/tiles/demo_lvl_bg.png",
  demo_lvl_bg_tmx: "res/tiles/demo_lvl_bg.tmx"
};

g_resources = [];

for (i in res) {
  if (res.hasOwnProperty(i)) {
    g_resources.push(res[i]);
  }
}

'use strict';

TouchHelper = function() {
  return {
    isTouchesExist: function() {
      return cc.sys.capabilities.hasOwnProperty('touches');
    },
    addOneTouchListener: function() {
      return cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function(touch, event) {
          var locationInNode, size, target;
          target = event.getCurrentTarget();
          locationInNode = target.convertToNodeSpace(touch.getLocation());
          size = target.getContentSize();
          return cc.log("Touch began at " + (touch.getLocationX()) + ", target: " + target + ", locationInNode: " + locationInNode + ", size: " + size);
        },
        onTouchMoved: function(touch, event) {
          var delta, target;
          target = event.getCurrentTarget();
          delta = touch.getDelta();
          return cc.log("Touch moved " + (touch.getLocationX()) + ", target: " + target + ", delta: " + delta);
        },
        onTouchEnded: function(touch, ended) {
          return cc.log("Touch ended " + (touch.getLocationX()));
        },
        onTouchCancelled: function(touch, event) {
          return cc.log("Touch cancelled " + (touch.getLocationX()));
        }
      }, this);
    },
    addMultiTouchListener: function() {
      return cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        onTouchesBegan: function(touches, event) {
          cc.log("Touches began " + (touches[0].getLocationX()));
          return cc.log("Touches began " + (touches[1].getLocationX()));
        },
        onTouchesMoved: function(touches, event) {
          return cc.log("Touches moved " + (touches[2].getLocationX()));
        }
      }, this);
    }
  };
};

//# sourceMappingURL=app.js.map
