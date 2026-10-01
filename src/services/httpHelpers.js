// Parsea el body JSON de una respuesta de apiFetch y lanza un error uniforme
// cuando la respuesta no es exitosa, usando el mensaje del backend si existe.
export const parseJsonResponse = async (response, defaultErrorMessage) => {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || defaultErrorMessage);
  }
  return result;
};
