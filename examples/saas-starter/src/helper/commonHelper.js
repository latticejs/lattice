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
 * Get the uploaded media type.
 * @param {string} filename [file name]
 * @return {string} [uploaded media type]
 */
const getFileType = (fileName) => {
  let fileExtension = fileName.split('.').pop();
  if (fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg') {
    return `image/${fileExtension}`;
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

export { randomString, getFileType, getFormattedDate, emailValidator, passwordValidator, getSelectOptions };
