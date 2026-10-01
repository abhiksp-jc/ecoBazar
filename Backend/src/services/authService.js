import axios from "axios";

const API_URL =
  "http://localhost:5000/api";

const ADMIN_URL =
  `${API_URL}/admin`;

const CATEGORY_URL =
  `${API_URL}/categories`;

export const login = async (
  email,
  password
) => {
  const response =
    await axios.post(
      `${ADMIN_URL}/login`,
      {
        email: email.trim(),
        password
      }
    );

  return response.data;
};

export const forgotPassword =
  async (email) => {
    const response =
      await axios.post(
        `${ADMIN_URL}/forgot-password`,
        {
          email: email.trim()
        }
      );

    return response.data;
  };

export const verifyResetOtp =
  async (token, otp) => {
    const response =
      await axios.post(
        `${ADMIN_URL}/verify-reset-otp/${token}`,
        {
          otp
        }
      );

    return response.data;
  };

export const resetPassword =
  async (
    token,
    password
  ) => {
    const response =
      await axios.post(
        `${ADMIN_URL}/reset-password/${token}`,
        {
          password
        }
      );

    return response.data;
  };

export const getToken = () =>
  localStorage.getItem("token");

export const getAdmin = () => {
  const admin =
    localStorage.getItem("admin");

  if (!admin) {
    return null;
  }

  try {
    return JSON.parse(admin);
  } catch {
    return null;
  }
};

export const createStaff =
  async (staffData) => {
    const token = getToken();

    const response =
      await axios.post(
        `${ADMIN_URL}/staff`,
        staffData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };

export const getStaff =
  async () => {
    const token = getToken();

    const response =
      await axios.get(
        `${ADMIN_URL}/staff`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };

export const updateStaff =
  async (
    id,
    staffData
  ) => {
    const token = getToken();

    const response =
      await axios.put(
        `${ADMIN_URL}/staff/${id}`,
        staffData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };

export const deleteStaff =
  async (id) => {
    const token = getToken();

    const response =
      await axios.delete(
        `${ADMIN_URL}/staff/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };

export const createCategory =
  async (categoryData) => {
    const token = getToken();

    const formData =
      new FormData();

    formData.append(
      "name",
      categoryData.name
    );

    formData.append(
      "description",
      categoryData.description ||
        ""
    );

    if (
      categoryData.image instanceof
      File
    ) {
      formData.append(
        "image",
        categoryData.image
      );
    }

    const response =
      await axios.post(
        CATEGORY_URL,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };

export const getCategories =
  async () => {
    const token = getToken();

    const response =
      await axios.get(
        CATEGORY_URL,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };

export const updateCategory =
  async (
    id,
    categoryData
  ) => {
    const token = getToken();

    const formData =
      new FormData();

    formData.append(
      "name",
      categoryData.name
    );

    formData.append(
      "description",
      categoryData.description ||
        ""
    );

    if (
      categoryData.image instanceof
      File
    ) {
      formData.append(
        "image",
        categoryData.image
      );
    }

    const response =
      await axios.put(
        `${CATEGORY_URL}/${id}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };

export const deleteCategory =
  async (id) => {
    const token = getToken();

    const response =
      await axios.delete(
        `${CATEGORY_URL}/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
};