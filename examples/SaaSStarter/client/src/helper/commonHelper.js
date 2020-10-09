import Player from '@vimeo/player';

/**
 * Return random string
 */
function randomString(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

/**
 * Function to test extenison of file name.
 * @param  {String} fileName [String value of file name]
 * @return {Boolean}        [Return boolean value]
 */
const isVideo = (fileName) => {
  let extension = fileName.split('.').pop();
  if (extension === 'png' || extension === 'jpeg' || extension === 'jpg') {
    return false;
  }
  return true;
};

/**
 * @description Create Vimeo player and set it to div element
 * @param {object} mediaList
 * @param {boolean} isWorkshop
 */
const createPlayer = (
  mediaList,
  isWorkshop = false,
  config = { useWidth: true }
) => {
  mediaList.map((data) => {
    let targetDiv = data.videoDivId;

    if (isWorkshop) {
      targetDiv = data.videoDivWorkshopId;
    }
    const selectedDiv = document.getElementById(targetDiv);

    if (selectedDiv) {
      const customUrl = new URL(data.url);
      let options = {
        id: parseFloat(customUrl.pathname.slice(1)),
        title: false,
      };
      if (config.useWidth) {
        options.width = config.width || 300;
      }

      const player = new Player(selectedDiv, options);

      if (selectedDiv.firstElementChild) {
        const { src } = selectedDiv.firstElementChild;
        let id = parseFloat(src.split('/')[4].split('?')[0]);
        if (id !== options.id) {
          // Reload the video and set the iframe src with updated video id
          player.loadVideo(options.id).then((res) => {
            selectedDiv.firstElementChild.src = `https://player.vimeo.com/video/${options.id}?title=0&app_id=${process.env.REACT_APP_VIMEO_APPID}`;
          });
        }
      }
    }
    return data;
  });
};

/**
 * Get the uploaded media type.
 * @param {string} filename [file name]
 * @return {string} [uploaded media type]
 */
const getFileType = (fileName) => {
  let fileExtension = fileName.split('.').pop();
  if (
    fileExtension === 'png' ||
    fileExtension === 'jpeg' ||
    fileExtension === 'jpg'
  ) {
    return `image/${fileExtension}`;
  }
  return `video/${fileExtension}`;
};

/**
 * Get the vimeo url.
 * @param {string} filename [vimeo video url]
 * @return {string} [vimeo video id]
 */
const getVimeoVideoId = (url) => {
  let regex = new RegExp(
    /(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/
  );
  if (regex.test(url)) {
    return regex.exec(url)[5];
  }
};

/**
 * Recieved ISO 8601 formatted date	 and format before render
 * @param {date} isoDate
 * @returns {string} formatted date
 */
const getFormattedDate = (isoDate) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const date = new Date(isoDate);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * emailValidator [validate email]
 * @param {email} Sting
 * @returns {boolean}
 */
const emailValidator = (email) => {
  const expression = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return expression.test(String(email).toLowerCase());
};

/**
 * passwordValidator [validate password]
 * @param {password} Sting
 * @returns {boolean}
 */
const passwordValidator = (password) => {
  const expression = /^(?=^.{8,32}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  return expression.test(password);
};

const getSelectOptions = (data, label, value) => {
  const array = [];
  data.forEach((item) => {
    const obj = { label: item[label], value: item[value] };
    array.push(obj);
  });
  return array;
};

export {
  randomString,
  isVideo,
  createPlayer,
  getFileType,
  getVimeoVideoId,
  getFormattedDate,
  emailValidator,
  passwordValidator,
  getSelectOptions,
};
