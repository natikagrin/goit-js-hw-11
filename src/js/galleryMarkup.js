export default function createGalleryMarkup(imagesArray) {
  return imagesArray.reduce((acc, image) => {
    const { webformatURL, largeImageURL, likes, views, comments, downloads } =
      image;
    return `${acc}
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="" title="" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes</b>${likes}</p>
        <p class="info-item"><b>Views</b>${views}</p>
        <p class="info-item"><b>Comments</b>${comments}</p>
        <p class="info-item"><b>Downloads</b>${downloads}</p>
      </div>
    </div>`;
  }, '');
}
