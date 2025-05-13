import * as PIXI from "pixi.js";

var stages = {}
const Screens = Object.freeze({
    HOME:         "home",
    LEVEL_ONE:    "level_one",
});

// (async () => {
async function initPixi() {
  // Create a new application
  const app = new PIXI.Application();

  // Initialize the application
  const container = document.getElementById("pixi-container");
  await app.init({ background: "#ace7e8", resizeTo: container });

  // Append the application canvas to the document body
  container.appendChild(app.canvas);

  const homeScreen = new PIXI.Container();
  stages[Screens.HOME] = homeScreen;

  const gameScreen = new PIXI.Container();
  stages[Screens.LEVEL_ONE] = gameScreen;

  GenerateHomeScreen(homeScreen, app);
  GenerateLevelOne(gameScreen, app);

  app.stage.addChild(homeScreen);
  app.stage.addChild(gameScreen);
  gameScreen.visible = false;

}
//})();

initPixi();

async function GenerateHomeScreen(container, app) {



  // Creating the Title
  const title_path = "./static/Title.svg";
  const title_asset = PIXI.Assets.load(title_path);
  title_asset.then((texture) => {

    const title = new PIXI.Sprite(texture);

    title.anchor.set(0.5);
    title.scale.set(0.5);
    title.x = app.screen.width / 2;
    title.y = app.screen.height / 2;

    title.interactive = true;
    title.buttonMode = true;
    title.on('pointerdown', () => {
      changeScreen(Screens.LEVEL_ONE);
    });

    title.on('pointerover', () => {
      title.scale.set(0.55);
    });

    title.on('pointerout', () => {
      title.scale.set(0.5);
    });
    
    title.on('pointerup', () => {
      title.scale.set(0.5);
    });
    
    container.addChild(title);

    app.renderer.on('resize', () => {
      title.x = app.screen.width / 2;
      title.y = app.screen.height / 2;
    });
  });

  // Creating the Subtitle 
  const subtitle_path = "./static/Subtitle.svg";
  const subtitle_asset = PIXI.Assets.load(subtitle_path);
  subtitle_asset.then((texture) => {
    const subtitle = new PIXI.Sprite(texture);

    subtitle.anchor.set(0.5);
    subtitle.scale.set(0.5);
    subtitle.x = app.screen.width / 2;
    subtitle.y = app.screen.height / 2 + subtitle.height + 50;

    container.addChild(subtitle);

    app.renderer.on('resize', () => {
      subtitle.x = app.screen.width / 2;
      subtitle.y = app.screen.height / 2 + subtitle.height + 50;
    });
  });

  // Creating the Rock
  const rock_path = "./static/Rock.svg";
  const rock_asset = PIXI.Assets.load(rock_path);
  rock_asset.then((texture) => {
    const rock = new PIXI.Sprite(texture);

    rock.anchor.set(0.5);
    rock.x = Math.random() * app.screen.width;
    rock.y = app.screen.height - 90;

    container.addChild(rock);

    let previous_screen_width = app.screen.width;
    app.renderer.on('resize', () => {
      rock.x = app.screen.width * (rock.x / previous_screen_width);
      rock.y = app.screen.height - 90;

      previous_screen_width = app.screen.width;
    });
  });

  // Creating the Grass
  const grass_platform_path = "./static/Grass_Platform.svg";
  const grass_platform_asset = PIXI.Assets.load(grass_platform_path); 
  grass_platform_asset.then((texture) => {
    const grass_platform = new PIXI.TilingSprite(texture, app.screen.width, 100); 

    grass_platform.width = app.screen.width;
    grass_platform.height = 100;
    grass_platform.x = 0;
    grass_platform.y = app.screen.height - grass_platform.height;

    container.addChild(grass_platform);

    app.renderer.on('resize', () => {
      grass_platform.width = app.screen.width;
      grass_platform.y = app.screen.height - grass_platform.height;
    });
  });


  const tree_paths = ["./static/Tree1.svg", "./static/Tree2.svg", "./static/Tree1.svg"];
  tree_paths.forEach(tree_path => {
    const tree_asset = PIXI.Assets.load(tree_path);
    tree_asset.then((texture) => {
      const tree = new PIXI.Sprite(texture);

      tree.anchor.set(0.5);
      tree.scale.set(0.65);
      tree.x = Math.random() * app.screen.width;
      const distance_from_bottom = 125;
      tree.y = app.screen.height - distance_from_bottom;

      container.addChild(tree);

      let previous_screen_width = app.screen.width;
      app.renderer.on('resize', () => {
        tree.x = app.screen.width * (tree.x / previous_screen_width);
        tree.y = app.screen.height - distance_from_bottom;

        previous_screen_width = app.screen.width;
      });
    });
  });



  // Creating the Clouds
  const cloud_paths = ["./static/Cloud1.svg", "./static/Cloud2.svg", "./static/Cloud2.svg"];
  cloud_paths.forEach(cloud_path => {
    const cloud_asset = PIXI.Assets.load(cloud_path);
    cloud_asset.then((texture) => {
      const cloud = new PIXI.Sprite(texture);

      cloud.anchor.set(0.5);
      cloud.x = Math.random() * (app.screen.width + cloud.width);
      cloud.y = Math.random() * (app.screen.height / 2) + cloud.height;

      container.addChild(cloud);
      
      let previous_screen_width = app.screen.width;
      let previous_screen_height = app.screen.height;
      app.renderer.on('resize', () => {
        cloud.x = app.screen.width * (cloud.x / previous_screen_width);
        cloud.y = app.screen.height * (cloud.y / previous_screen_height);

        previous_screen_width = app.screen.width;
        previous_screen_height = app.screen.height;
      });

      app.ticker.add(() => {
        if (cloud.x < 0 - cloud.width) {
          cloud.x = app.screen.width + cloud.width;
          cloud.y = Math.random() * (app.screen.height / 2) + cloud.height;
        }
        cloud.x -= 1;
      });
    });
  });

  const idle_player_path = "./static/Joey.svg";
  const right_player_path = "./static/Joey_Right.svg";
  const left_player_path = "./static/Joey_Left.svg";
  const player_asset = await PIXI.Assets.load(idle_player_path);
  const right_player_asset = await PIXI.Assets.load(right_player_path);
  const left_player_asset = await PIXI.Assets.load(left_player_path);

  const player = new PIXI.Sprite(player_asset);

  player.anchor.set(0.5);
  player.scale.set(0.4);
  player.x = app.screen.width / 2;
  player.y = 0;// app.screen.height / 2 - player.height;

  container.addChild(player);

  let previous_screen_width = app.screen.width;
  let previous_screen_height = app.screen.height;
  app.renderer.on('resize', () => {
    player.x = app.screen.width * (player.x / previous_screen_width);
    player.y = app.screen.height * (player.y / previous_screen_height);

    previous_screen_width = app.screen.width;
    previous_screen_height = app.screen.height;
  });

  let velocityY = 0;
  let movementSpeed = 5;
  const gravity = 0.5;
  const jumpStrength = -15;
  const groundY = app.screen.height - 75; // Assuming your platform is 100px tall


  const keys = {
    left: false,
    right: false,
    up: false
  };

  app.ticker.add(() => {
    // Apply gravity
    velocityY += gravity;
    player.y += velocityY;

    // Collision with ground
    if (player.y >= groundY) {
      player.y = groundY;
      velocityY = 0;
    }

    // Horizontal movement
    if (keys.left) {
      player.x -= movementSpeed;
      player.texture = right_player_asset;
    }
    else if (keys.right) {
      player.x += movementSpeed;
      player.texture = left_player_asset;
    }
    else {
      player.texture = player_asset;
    }

    // Jumping
    if (keys.up && player.y >= groundY) {
      velocityY = jumpStrength;
    }
  });


  window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") keys.up = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") keys.up = false;
  });

}

async function changeScreen(screen) {
  for (const stage in stages) {
    console.log(stage);
    if (stage != screen)
      stages[stage].visible = false;
    else
      stages[stage].visible = true;
  }
}


async function GenerateLevelOne(container, app) {
  const platform1_path = "./static/Platform1.svg";
  const platform1_asset = await PIXI.Assets.load(platform1_path);

  const platform = new PIXI.Sprite(platform1_asset);

  platform.anchor.set(0.5);
  platform.scale.set(0.8);
  platform.x = platform.width / 2 + 20;
  platform.y = app.screen.height - 50;

  container.addChild(platform);


  let previous_screen_width = app.screen.width;
  let previous_screen_height = app.screen.height;
  app.renderer.on('resize', () => {
    platform.x = app.screen.width * (platform.x / previous_screen_width);
    platform.y = app.screen.height * (platform.y / previous_screen_height);

    previous_screen_width = app.screen.width;
    previous_screen_height = app.screen.height;
  });


  const idle_player_path = "./static/Joey.svg";
  const right_player_path = "./static/Joey_Right.svg";
  const left_player_path = "./static/Joey_Left.svg";
  const player_asset = await PIXI.Assets.load(idle_player_path);
  const right_player_asset = await PIXI.Assets.load(right_player_path);
  const left_player_asset = await PIXI.Assets.load(left_player_path);

  const player = new PIXI.Sprite(player_asset);

  player.anchor.set(0.5);
  player.scale.set(0.4);
  player.x = platform.width / 2;
  player.y = 0;

  container.addChild(player);

  app.renderer.on('resize', () => {
    player.x = app.screen.width * (player.x / previous_screen_width);
    player.y = app.screen.height * (player.y / previous_screen_height);

    previous_screen_width = app.screen.width;
    previous_screen_height = app.screen.height;
  });

  let velocityY = 0;
  let movementSpeed = 5;
  const gravity = 0.5;
  const jumpStrength = -15;
  const groundY = app.screen.height - 75; // Assuming your platform is 100px tall


  const keys = {
    left: false,
    right: false,
    up: false
  };

  app.ticker.add(() => {
    // Apply gravity
    velocityY += gravity;
    player.y += velocityY;

    // Collision with ground
    if (player.x >= platform.x - platform.width/2 && player.y <= platform.x + platform.width/2 && player.y >= platform.y - platform.height) {
      player.y = platform.y - platform.height;
      velocityY = 0;
    }

    // Horizontal movement
    if (keys.left) {
      player.x -= movementSpeed;
      player.texture = right_player_asset;
    }
    else if (keys.right) {
      player.x += movementSpeed;
      player.texture = left_player_asset;
    }
    else {
      player.texture = player_asset;
    }

    // Jumping
    if (keys.up && player.y >= groundY) {
      velocityY = jumpStrength;
    }
  });


  window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") keys.up = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") keys.up = false;
  });

}
/*
async function GenerateLevelOne(container, app) {
  // Create the Character

  // === Create Code Input Area ===
  const codeBox = document.createElement("textarea");
  const runBtn = document.createElement("button");

  codeBox.placeholder = "Type code (e.g., moveRight();)";
  runBtn.textContent = "Run Code";

  Object.assign(codeBox.style, {
    position: "absolute",
    bottom: "80px",
    left: "20px",
    width: "300px",
    height: "60px",
    fontSize: "16px",
    backgroundColor: "#1e1e1e",
    color: "#00ff00",
    border: "2px solid #333",
    padding: "10px"
  });

  Object.assign(runBtn.style, {
    position: "absolute",
    bottom: "10px",
    left: "20px",
    width: "120px",
    height: "40px",
    fontSize: "16px",
    backgroundColor: "#333",
    color: "#fff",
    cursor: "pointer"
  });

  document.body.appendChild(codeBox);
  document.body.appendChild(runBtn);

  runBtn.onclick = () => {
    const code = codeBox.value.trim();
    if (code === "moveRight();") {
      moveCharacter();
    } else {
      alert("❌ Incorrect code. Try again!");
    }
  };

  function moveCharacter() {
    const targetX = app.screen.width - 100;

    const move = () => {
      if (character.x < targetX) {
        character.x += 4;
        requestAnimationFrame(move);
      } else {
        showLevelComplete();
      }
    };

    move();
  }

  function showLevelComplete() {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Level 2 →";
    Object.assign(nextBtn.style, {
      position: "absolute",
      top: "20px",
      left: "20px",
      fontSize: "18px",
      padding: "10px 20px",
      backgroundColor: "#4caf50",
      color: "white",
      border: "none",
      cursor: "pointer"
    });

    document.body.appendChild(nextBtn);
    nextBtn.onclick = () => {
      alert("✅ Proceeding to Level 2...");
      // You can import level 2 here or redirect
    };
  }
}
*/