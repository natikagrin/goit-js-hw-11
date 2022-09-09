import PixabayApiService from './pixabay-service';
import createGalleryMarkup from './gallery-markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.forms['search-form'],
  gallery: document.querySelector('.gallery'),
  footer: document.querySelector('footer'),
};

const pixabayApiService = new PixabayApiService();
const gallery = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(evt) {
  evt.preventDefault();

  pixabayApiService.resetPage();
  pixabayApiService.query = evt.currentTarget.searchQuery.value;
  infitityScrollOff();
  scrollToTop();

  try {
    const { hits, totalHits } = await pixabayApiService.fetchImages();

    clearGallery();
    if (totalHits > 0) {
      notifySearchResult(totalHits);
      renderGallery(hits);
      infitityScrollOn();
    } else notifyNoSearchResult();
  } catch (error) {
    console.log(error);
  }
}

async function loadMore() {
  try {
    const { hits } = await pixabayApiService.fetchImages();
    if (hits.length > 0) {
      renderGallery(hits);
      autoScroll();
    } else {
      notifyNoMoreSearchResult();
      infitityScrollOff();
    }
  } catch (error) {
    console.log(error);
  }
}

function autoScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function renderGallery(imagesArray) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    createGalleryMarkup(imagesArray)
  );
  gallery.refresh();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function notifySearchResult(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function notifyNoSearchResult() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notifyNoMoreSearchResult() {
  Notify.warning("We're sorry, but you've reached the end of search results.");
}

const options = {
  root: null,
  rootMargins: '0px',
  threshold: 0,
};

const scrollObserver = new IntersectionObserver(handleIntersect, options);

function handleIntersect(entries) {
  if (entries[0].isIntersecting) {
    loadMore();
  }
}

function infitityScrollOn() {
  scrollObserver.observe(refs.footer);
}

function infitityScrollOff() {
  scrollObserver.unobserve(refs.footer);
}
