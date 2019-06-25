import axios from 'axios';
// Cria o corpo da requisição adicionando o arquivo
const createFormData = (photo) => {
  let data = new FormData();
  data.append("image", {
    uri: photo.uri,
    name: 'image.jpg',
    type: 'image/jpeg'
  });
  return data;
};

export async function handleUpload(uri) {
  // Corpo da requisição  
  const bodyData = createFormData(uri);
  // Instância do axios realizando requisição a api  
  const text = await axios({
    url: "https://706be4b9.ngrok.io/upload",
    method: "post",
    data: bodyData,
    // Configura os headers para aceitarem arquivos  
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  }).then(response => {
    return response;
  })
    .catch(error => {
      return { data: "falha ao processar texto" };
    });
  // Retorna o texto processado ou mensagem de erro  
  return text.data;
};