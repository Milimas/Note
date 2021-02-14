// Element from the DOM
const TITLE_INPUT = document.getElementById('title');                                       // * Note Title
const SART_TIME_INPUT = document.getElementById('startTime');                               // * Note Start Time
const END_TIME_INPUT = document.getElementById('endTime');                                  // * Note End Time
const DATE_INPUT = document.getElementById('date');                                         // * Note Date
const NOTE_INPUT = document.getElementById('note');                                         // * Note Textarea
const ADD_NEW_BUTTON = document.getElementById('addNew');                                   // * Add New Button
const EDIT_BOX = document.getElementsByClassName('editBox')[0];                             // * Edit & Cancel Buttons Container
const EDIT_BUTTON = document.getElementById('edit');                                        // * Edit Button
const CANCEL_BUTTON = document.getElementById('cancel');                                    // * Cancel Button
const NOTES_SECTION = document.getElementById('notes');                                     // * Notes Container
const FORM = document.getElementById('form');                                               // * Form
const REQUIRED = FORM.querySelectorAll("[required]");                                       // * All Required Inputs in Form

const today = new Date();                                                                   // ? Get Today Date
const Default_Date = today.toISOString().slice(0,10);                                       // * Default Date
const Default_Start_Time = today.toTimeString().slice(0,5);                                 // * Default Start Time
today.setMinutes(today.getMinutes() + 1);                                                   // ? Add 1min to Today Date
const Default_End_Time = today.toTimeString().slice(0,5);                                   // * Defualt End Time
SART_TIME_INPUT.value = Default_Start_Time;                                                 // ? Fill START_TIME_INPUT with Default_Start_Time
END_TIME_INPUT.value = Default_End_Time;                                                    // ? Fill END_TIME_INPUT with Default_End_Time
DATE_INPUT.value = Default_Date;                                                            // ? Fill DATE_INPUT with Default_Date

var Started_Audio = new Audio('Task_Start.mp3');                                            // ? Ended Task Audio
var Ended_Audio = new Audio('Task_End.mp3');                                                // ? Started Task Audio

Notification.requestPermission();                                                           // ! Request Notification Permission

/**
 * @name formPreventDefault
 * @type Boolean
 * @description Prevent Default FORM Action
 */
const formPreventDefault = () => {
    return false;
};
FORM.addEventListener('submit', formPreventDefault);

/**
 * @name notes
 * @type Object
 * @description Contain Notes Objects from localStorage
 */
var notes = [];
notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : notes;  // ! If there is notes in localStorage insert them in notes variable

/**
 * @name on_Editing
 * @type Int
 * @description Contain the Id of the Note currently editing if there is, else its null 
 */
var on_Editing = null;

/**
 * @name deleteElement
 * @type Void
 * @description Delete the Note by id
 * @param {int} id Id of Note
 */
const deleteElement = (id) => {
    notes = notes.filter((note) => note.id !== id );                                        // ? Get all element except the one with id
    addElementsToDom();                                                                     // ! Refresh DOM
}

/**
 * @name editElement
 * @type Void
 * @description Fill the FORM with the values of the requested Note, Hide add new control and display edit controls
 * @param {int} id 
 */
const editElement = (id) => {
    const note = notes[id];                                                                 // ? Get Note by id
    TITLE_INPUT.value = note.title;                                                         // * Insert     title       value to  TITLE_INPUT
    SART_TIME_INPUT.value = note.startTime;                                                 // * ..         startTime   ..        SART_TIME_INPUT
    END_TIME_INPUT.value = note.endTime;                                                    // * ..         endTime     ..        END_TIME_INPUT
    DATE_INPUT.value = note.date;                                                           // * ..         date        ..        DATE_INPUT
    NOTE_INPUT.value = note.note;                                                           // * ..         note        ..        NOTE_INPUT
    EDIT_BOX.style.display = "block";                                                       // ? Display Edit & Cancel Buttons
    ADD_NEW_BUTTON.style.display = "none";                                                  // ? Hide Add New Button
    on_Editing = id;                                                                        // ? Insert id of the note currently editing
}

/**
 * @name confirmEdit
 * @type Void
 * @description Add new Note and delete the Note on Editing
 */
const confirmEdit = () => {
    deleteElement(on_Editing);                                                              // ! Delete the Note currently editing
    addNew();                                                                               // ! Add new Note to Dom and Storage
    cancelEdit();                                                                           // ! Emty all input Fields
}
EDIT_BUTTON.addEventListener('click', confirmEdit);

/**
 * @name cancelEdit
 * @type Void
 * @description Nullify all Input fields in FORM, Hide edit controls and display add new control
 */
const cancelEdit = () => {
    TITLE_INPUT.value = null;                                                               // * Nullify TITLE_INPUT
    SART_TIME_INPUT.value = Default_Start_Time;                                             // * Default SART_TIME_INPUT
    END_TIME_INPUT.value = Default_End_Time;                                                // * Default END_TIME_INPUT
    DATE_INPUT.value = Default_Date;                                                        // * Default DATE_INPUT
    NOTE_INPUT.value = null;                                                                // * Nullify NOTE_INPUT
    EDIT_BOX.style.display = "none";                                                        // ? Hide Edit & Cancel Buttons
    ADD_NEW_BUTTON.style.display = "block";                                                 // ? Display Add New Button
    on_Editing = null;                                                                      // ? Nullify id of the note currently editing
}
CANCEL_BUTTON.addEventListener('click', cancelEdit);

/**
 * @name addNew
 * @type Void
 * @description Add new Note to DOM and LocalStorage
 */
const addNew = (e) => {
    e.preventDefault();
    let lastid = notes.length;                                                              // ? Get last ID from notes
    requiredFull = true;                                                                    // ? Variable to track required fields if empty, Default value is true
    REQUIRED.forEach(element => {                                                           // ! Loop through inputs of REQUIRED fields
        if (element.value === '') {                                                         // ! Check if input value id empty
            requiredFull = false;                                                           // ? If input value empty change required to false
            return;                                                                         // ! Break from Loop
        }
    });
    if (requiredFull) {                                                                     // ! Check if all required element are full
        const note = {                                                                      // ? Create an Object note
            id: lastid,                                                                     // * fill note id with last id from notes object
            title: TITLE_INPUT.value,                                                       // * fill title       with  TITLE_INPUT         value
            startTime: SART_TIME_INPUT.value,                                               // * ..   startTime   ..    START_TIME_INPUT    ..
            endTime: END_TIME_INPUT.value,                                                  // * ..   endTime     ..    END_TIME_INPUT      ..
            date: DATE_INPUT.value,                                                         // * ..   date        ..    DATE_INPUT          ..
            note: NOTE_INPUT.value,                                                         // * ..   note        ..    NOTE_INPUT          ..
            active: null,                                                                   // * ..   ative       ..    null                ..
        }
        if (note.startTime < note.endTime) {                                                // ! Check if start time before end time
            notes[lastid] = note;                                                           // ? Insert note Object at end of notes Object
            addElementsToDom();                                                             // ! Add elemnts to DOM
        }
        else                                                                                // ! Else if start time is after or equal to end time
        alert('Start Time bigger or equal to end Time');                                    // ? alert user
    }

};
ADD_NEW_BUTTON.addEventListener('click', addNew);

/**
 * @name insertNewNote
 * @type Void
 * @description Create a note HTML Element and add it to NOTES_SECTION
 * @param {note} note
 */
const insertNewNote = ({id, title, startTime, endTime, date, note, active}) => {
    const NOTE_COMPONENT =                                                                  // ? Variable note HTML Component
    `
    <div class="note ${active}" id="note-${id}">
    <div class="detials">
    <h2 class="note-title">${title}</h2>
    <small class="note-time">
    ${startTime} - ${endTime} / ${date}
    </small> 
    <p class="note-text">
    ${note}
    </p>
    </div>
    <div class="control">
    <button class="delete" onclick="deleteElement(${id})">Delete</button>
    <button class="edit" onclick="editElement(${id})">Edit</button>
    </div>
    </div>
    `;
    NOTES_SECTION.innerHTML += NOTE_COMPONENT;                                              // ? Insert NOTE_COMPONENT to NOTE_SECTION
}

/**
 * @name writeToStorage
 * @type Void
 * @description Convert notes Object to Json format and store it in Local Storage
 */
function writeToStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));                                   // ! Json format notes Object and store it in Local Storage
}

/**
 * @name addElementsToDom
 * @type Void
 * @description Refresh Note section
 */
function addElementsToDom() {
    NOTES_SECTION.innerHTML = null;                                                         // ? Empty NOTES_SECTION
    sortNotes();                                                                            // ! Sort notes element by date and startTime

    if (notes.length > 0)                                                                   // ! Check if notes has objects
        notes.forEach((note, key) => {                                                      // ! Loop through notes objects
            addClassToNote(note, key);                                                      // ! Add bg class depending on date and startTime values
            insertNewNote(note);                                                            // ! Insert note to NOTES_SECTION
        });
}

/**
 * @name addClassToNote
 * @type Void
 * @description Adds background class to note depending on dat and start time compare to current date and time
 * @param {note} note note Object 
 * @param {int} key key of the note Object
 */
function addClassToNote(note, key) {
    note.id = key;                                                                          // ? Update note ID with Object key
    currDate = new Date();                                                                  // ? Get current date and time
    noteStartDate = new Date(`${note.date} ${note.startTime}`);                             // ? Get noteStartDate
    noteEndDate = new Date(`${note.date} ${note.endTime}`);                                 // ? Get noteEndDate
    let active = null;
    if (currDate > noteStartDate) {                                                         // ! Check if currDate after noteStartDate
        if (currDate > noteEndDate) {                                                       // ! Check if currDate after noteEndDate
            active = 'bg-danger';                                                           // * Add class bg-danger to note
        } else {                                                                            // ! Else if currDate before noteEndDate
            active = 'bg-green';                                                            // * Add class bg-green to note
        }
    } else {                                                                                // ! Else if currDate before noteStartDate
        active = 'bg-primary';                                                              // * Add class bg-primary to note
    }
    if (note.active !== active) {                                                           // ! Check if active need to be change
        notification = {
            title: note.title,                                                              // * Notification Title
            body: note.note,                                                                // * Notification Body
            image: null                                                                     // * Notification Image
        }
        if (active === 'bg-danger') {                                                       // ! Check if active need to be change to bg-danger
            Ended_Audio.play();                                                             // ! Play Sound when a task Ended
            notification.title += `- TIME OUT`;                                             // * Add Time out to Title
            notification.image = './End.jpg';                                               // * Insert path to End image
        }
        else if (active === 'bg-green') {                                                   // ! Check if active need to be change to bg-green
            Started_Audio.play();                                                           // ! Play Sound when a task Started
            notification.title += `- START NOW`;                                            // * Add Start now to Title
            notification.image = './Start.jpg';                                             // * Insert path to Start image                                             
        }
        displayNotification(notification);                                                  // ! Create and display Notification
        note.active = active;                                                               // * Change note active value to needed change
    }
    writeToStorage();                                                                       // ! Write notes to Local Storage
}

/**
 * @name displayNotification
 * @type Void
 * @description Create and display Notification
 */
function displayNotification({title, body, image}) {
    notification = new Notification(                                                        // ! Create new Notification Object
        title,                                                                              // * Title
        {
            body: body,                                                                     // * Body
            image: image                                                                    // * Image
        });
    notification.onclick = () => {                                                          // ! Adding on click event listner to notification
        window.focus();                                                                     // ? Focus on this window
        this.close();                                                                       // ? Close notification
    };
}

/**
 * @name sortNotes
 * @type Float
 * @description Sort notes array by date and startTime
 */
function sortNotes() {
    notes = notes.sort((a, b) => {
        a_dateTime = new Date(`${a.date} ${a.startTime}`);                                  // * Create new Date with a date and startTime
        b_dateTime = new Date(`${b.date} ${b.startTime}`);                                  // * ..     ..  ..   ..   b ..   ..  ..  
        return a_dateTime - b_dateTime;                                                     // ! Returns difference btween date a and date b
    });
}

addElementsToDom();                                                                         // ! Init note to NOTES_SECTION
setInterval(addElementsToDom, 60000);                                                       // ! Refresh NOTES_SECTION every 60 seconds