const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

//Route 1: Get the user notes by using get request Get: '/api/notes/fetchnotes' : login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {

        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has occured");
    }
})

//Route 2: Add the notes by using post request Post: '/api/notes/fetchnotes' : login required

router.post('/addnotes', fetchuser, [
    body('title', "Enter a title to notes").isLength({ min: 3 }),
    body('description', "Enter a description to the notes").isLength({ min: 8 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({ title, description, tag, user: req.user.id })
        const savedNotes = await note.save()
        res.json(savedNotes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has occured");
    }
})

//Route 3: Update the notes by using put request Put: '/api/notes/fetchnotes' : login required

router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {

        // Create newnotes
        const newNote = {}
        if (title) {
            newNote.title = title
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag
        }
        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if (!note) {
            res.status(404).send("Note Found")
        }
        // Checking wheither the user updating his/her notes not anyone else
        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has occured");
    }
})
//Route 4: Delete the existing notes using Delete request: '/api/notes/fetchnotes' : login required

router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    try {

        // Find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id)
        if (!note) {
            res.status(404).send("Note Found")
        }
        // Checking wheither the user updating his/her notes not anyone else
        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note is deleted successfully", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error has occured");
    }
})
module.exports = router