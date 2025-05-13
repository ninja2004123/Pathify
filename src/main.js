import * as PIXI from "pixi.js";

(async () => {
  // Create a new application
  const app = new PIXI.Application();

  // Initialize the application
  const container = document.getElementById("pixi-container");
  await app.init({ background: "#ace7e8", resizeTo: container });

  // Append the application canvas to the document body
  container.appendChild(app.canvas);

  // Creating the Title
  const title_path = "./static/Title.svg";
  const title_asset = PIXI.Assets.load(title_path); 
  title_asset.then((texture) => {

    const grass_platform = new PIXI.Sprite(texture);

    grass_platform.anchor.set(0.5);
    grass_platform.scale.set(0.5);
    grass_platform.x = app.screen.width / 2;
    grass_platform.y = app.screen.height / 2;

    app.stage.addChild(grass_platform);

    app.renderer.on('resize', () => {
      grass_platform.x = app.screen.width / 2;
      grass_platform.y = app.screen.height / 2;
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

    app.stage.addChild(grass_platform);

    app.renderer.on('resize', () => {
      grass_platform.width = app.screen.width;
      grass_platform.y = app.screen.height - grass_platform.height;
    });
  });

  // Creating the Clouds
  const cloud_paths = ["./static/Cloud1.svg", "./static/Cloud2.svg", "./static/Cloud2.svg"];
  cloud_paths.forEach(cloud_path => {
    const cloud_asset = PIXI.Assets.load(cloud_path);
    cloud_asset.then((texture) => {
      const cloud = new PIXI.Sprite(texture);

      cloud.anchor.set(0.5);
      cloud.scale.set(0.5);
      cloud.x = Math.random() * (app.screen.width + cloud.width);
      cloud.y = Math.random() * (app.screen.height / 2) + cloud.height;

      app.stage.addChild(cloud);
      
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

})();