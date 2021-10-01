const axios = require("axios");
const querystring = require("querystring");
const { constants } = require("http2");
const { Agent } = require("https");
const cookieParser = require("../utils/cookieParser");

const MSG_AUTHENTICATED_SUCCESSFULLY =
  "for redirecionado automaticamente clique aqui.";

class UniaraService {
  static #httpsAgent = new Agent({
    rejectUnauthorized: false,
  });

  static #service = axios.create({
    baseURL: "https://virtual.uniara.com.br",
  });

  static #session;

  static declareInterceptor() {
    this.#service.interceptors.request.use(
      (config) => {
        config.httpsAgent = this.#httpsAgent;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  static async index() {
    this.#assertAuthenticated();

    return this.#service.get("/alunos/index", {
      headers: {
        Cookie: this.#session.cookies.reduce((a, b) => `${a}; ${b}`),
      },
    });
  }

  static async managePresence({ action = "verifica-lista", random }) {
    this.#assertAuthenticated();

    const parameters = querystring.stringify({
      acao: action,
      rand: random,
    });

    return this.#service.post(
      "/x_alunos/ajaxfrequenciaonline.php",
      parameters,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Cookie: this.#session.cookies.reduce((a, b) => `${a}; ${b}`),
        },
      }
    );
  }

  static async authenticate({ ra, password }) {
    const parameters = querystring.stringify({
      username: ra,
      senha: password,
      ...this.#getRandomCoordinateSubmitButton(),
    });

    const response = await this.#service.post("/login", parameters, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    const { status, data, headers } = response;

    if (
      status === constants.HTTP_STATUS_OK &&
      data.indexOf(MSG_AUTHENTICATED_SUCCESSFULLY) != -1
    ) {
      const cookies = headers["set-cookie"];

      this.#session = {
        cookies,
        final: Object.fromEntries(cookies.map(cookieParser)),
      };

      return {
        success: true,
        createdSession: this.#session,
      };
    }

    throw new Error(
      "Problem during authentication, please check your credentials. HTTP_STATUS: " +
        status
    );
  }

  static #getRandomCoordinateSubmitButton() {
    return {
      x: parseInt(Math.random(0) * 45),
      y: parseInt(Math.random() * 20),
    };
  }

  static #assertAuthenticated() {
    if (!this.#session) {
      throw new Error("Make the authentication first");
    }
  }
}

module.exports = UniaraService;
