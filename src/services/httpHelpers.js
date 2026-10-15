// Parsea el body JSON de una respuesta de apiFetch y lanza un error uniforme
// cuando la respuesta no es exitosa, usando el mensaje del backend si existe.
export const parseJsonResponse = async (response, defaultErrorMessage) => {
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.message || defaultErrorMessage);
    // Permite a quien captura distinguir p. ej. un 400 de negocio de un 500.
    error.status = response.status;
    throw error;
  }
  return result;
};
