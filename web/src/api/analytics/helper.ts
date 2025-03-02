import axios from "axios";

export class Helper {
  constructor() {}

  async getUserKpi() {
    return await axios
      .get("/analytics/user-kpi")
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }
}
