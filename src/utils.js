export const getCSRFToken = () =>
  document.getElementsByTagName('meta')['csrf-token'] !== undefined ? 
    document.getElementsByTagName('meta')['csrf-token'].content : ''

export const getCentre = () =>
  document.getElementById('root').dataset.centre ? document.getElementById('root').dataset.centre : ''