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

  async createFile(
    hwid: string,
    filePath: string,
    content: string,
    type: string
  ) {
    return axios
      .post(`clients/${hwid}/file/create?filepath=${filePath}`, {
        content: content,
        type: type,
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

  async getFileTree(hwid: string, path: string) {
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

  async uploadFileToClient(
    hwid: string,
    files: File[],
    destination: string,
    onProgress: (percentage: number) => void
  ) {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    return axios
      .post(`clients/${hwid}/file/upload?filepath=${destination}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            progressEvent.total
              ? (progressEvent.loaded * 100) / progressEvent.total
              : 0
          );
          onProgress(percentage);
        },
      })
      .then((response) => {
        console.log(response.data);

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
        `clients/${hwid}/file/download?filepath=${filePath}&filename=${filename}`,
        {
          responseType: "blob",
        }
      )
      .then((response) => {
        if (response.status !== 200) return { status: false };

        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        return { status: true };
      })
      .catch(() => {
        return { status: false };
      });
  }
}
