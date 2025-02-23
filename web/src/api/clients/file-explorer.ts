import axios from "axios";

export class FileExplorer {
  constructor() {}

  async createFileExplorer(hwid: string) {
    return axios
      .post(`clients/${hwid}/file-explorer/create`)
      .then((response) => {
        if (response.status !== 201) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getFileExplorersByUserId() {
    return axios
      .get("clients/file-explorers")
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async deleteFileExplorer(hwid: string) {
    return axios
      .delete(`clients/${hwid}/file-explorer/delete`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        return { data: null, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async createFile(hwid: string, filePath: string, content: string) {
    return axios
      .post(`clients/${hwid}/file/create?filepath=${filePath}`, {
        content: content,
      })
      .then((response) => {
        if (response.status !== 201) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async readFile(hwid: string, filePath: string) {
    return axios
      .get(`clients/${hwid}/file/read?filepath=${filePath}`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async updateFile(hwid: string, filePath: string, content: string) {
    return axios
      .patch(`clients/${hwid}/file/update?filepath=${filePath}`, {
        content: content,
      })
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        return { data: null, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async deleteFile(hwid: string, filePath: string) {
    return axios
      .delete(`clients/${hwid}/file/delete?filepath=${filePath}`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        return { data: null, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getFileTre(hwid: string, path: string) {
    return axios
      .get(`clients/${hwid}/file/tree?path=${path}`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async uploadFileToClient(hwid: string, files: File[], destination: string) {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    return axios
      .post(
        `clients/${hwid}/file/upload?destination=${destination}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.status !== 201) return { data: null, status: false };

        return { data: null, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async downloadFileFromClient(
    hwid: string,
    filePath: string,
    filename: string
  ) {
    return axios
      .get(
        `clients/${hwid}/download?filepath=${filePath}&filename=${filename}`,
        {
          responseType: "blob",
        }
      )
      .then((response) => {
        if (response.status !== 200) return { status: false };

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return { status: true };
      })
      .catch(() => {
        return { status: false };
      });
  }
}
