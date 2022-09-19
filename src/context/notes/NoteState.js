import React from "react";
import { useState } from "react";
import NoteContext from "./noteContext"
const NoteState = (props) => {
  const host = "http://localhost:5000"
  const intialState = []
  const [notes, setNotes] = useState(intialState)

  // Get All Note
  const getNote = async () => {
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify()
    });
    const json = await response.json();
    console.log(json)
    setNotes(json)
  }
  // Add Note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const note = await response.json();
    setNotes(notes.concat(note))
  }

  // Delete a Note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    const json = await response.json();
    console.log(json);
    console.log("Deleting a note with id " + id)
    const newNote = notes.filter((note) => { return note._id !== id })
    setNotes(newNote);
  }

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = await response.json();
    console.log(json)
    let newNotes = JSON.parse(JSON.stringify(notes)) 
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      setNotes(newNotes)
    }
  }
  return (
    <NoteContext.Provider value={{ notes, deleteNote, addNote, editNote, getNote }}>
      {props.children}
    </NoteContext.Provider>
  )

}
export default NoteState