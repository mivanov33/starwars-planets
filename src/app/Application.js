import config from '../config';
import EventEmitter from 'eventemitter3';

const EVENTS = {
  APP_READY: 'app_ready',
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
  constructor() {
    super();

    this.config = config;
    this.data = {};

    this.init();
  }

  static get events() {
    return EVENTS;
  }

  /**
   * Initializes the app.
   * Called when the DOM has loaded. You can initiate your custom classes here
   * and manipulate the DOM tree. Task data should be assigned to Application.data.
   * The APP_READY event should be emitted at the end of this method.
   */
  async init() {
    // Initiate classes and wait for async operations here.
    
    const fetchPlanets = async() => {
      const planets = await fetch("https://swapi.booost.bg/api/planets/");
      const planetsIntoJson = await planets.json();
  
      this.data.planets = planetsIntoJson.results;
      this.data.count = planetsIntoJson.count;
  
      let planet = planetsIntoJson;
      while (planet.next) {
        planet = await (await fetch(planet.next)).json();
        this.data.planets = [...this.data.planets, ...planet.results];
      }
    };

    await fetchPlanets();
    this.emit(Application.events.APP_READY);
  }
}

