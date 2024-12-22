function getErrorMessage(error) {
  if (error.response) {
    if (error.response.data) {
      if (error.response.data.message) {
        return error.response.data.message;
      }
      return error.response.data;
    }
  }
  return null;
}
