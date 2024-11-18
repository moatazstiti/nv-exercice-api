const express = require("express")
const Person = require("../model/Person")

const router=express.Router()




//ajout
router.post('/add',async(req,res)=>{
    try{
        const{Name,Age,favoriteFoods}=req.body;
        const newPerson=await Person.create({Name,Age,favoriteFoods});
        res.status(200).send({msg:'person added', newPerson})
    }catch(error){
        res.status(400).send({msg:'can not added person'})
    }
})

//afficher
router.get('/all',async(req,res)=>{
    try{
        const listPersons= await Person.find();
        res.status(200).send({msg:'person list:',listPersons:listPersons})
        
    }catch(error){
        res.status(400).send({msg:'not person'})

    }
})

// trouver toutes les personnes avec un nom donné


router.get('/:_name', async (req, res) => {
    try {
        const { _name } = req.params; // Extract the name from the URL parameter

        // Use the `Person` model to find documents with the matching name
        const person = await Person.find({ name: _name });

        // Send the found person(s)
        res.status(200).send({ msg: 'Person(s) found', persons: person });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).send({ msg: 'Cannot find person', error: error.message });
    }
});








//Trouver Person par son food

router.get('/_favoriteFoods', async (req, res) => {
    try {
        // Récupérer l'aliment spécifique
        const favoriteFood = req.params._favoriteFoods;
        const person = await Person.find({ favoriteFood: favoriteFood });
     
        res.status(200).send({ msg: 'Person found', person:person });
    } catch (error) {
        res.status(400).send({ msg: 'Cannot find person', error: error.message });
    }
});


        // Cherche une personne dans la base de données par _id


      
        router.get('/:_id', async (req, res) => {
            try {
                const personId = req.params._id;
        
                // Check if the ID is a valid ObjectId
                if (!/^[0-9a-fA-F]{24}$/.test(personId)) {
                    return res.status(400).send({ msg: 'Invalid ID format' });
                }
        
                // Find the person by _id
                const person = await Person.findById(personId);
        
                // Check if the person exists
                if (!person) {
                    return res.status(404).send({ msg: 'Person not found' });
                }
        
                // Send the response
                res.status(200).send({ msg: 'Person retrieved successfully', data: person });
            } catch (error) {
                // Handle errors gracefully
                console.error(error);
                res.status(500).send({ msg: 'An error occurred', error: error.message });
            }
        });
        



// modifier un person et ajouter un food

router.put('/addfavfood/:_id', async (req, res) => {
    try {
        const personId = req.params._id;

        // Vérifie si l'ID est un ObjectId valide
        if (!/^[0-9a-fA-F]{24}$/.test(personId)) {
            return res.status(400).send({ msg: 'Invalid ID format' });
        }

        // Recherche de la personne par son _id
        const person = await Person.findById(personId);

        // Vérifie si la personne existe
        if (!person) {
            return res.status(404).send({ msg: 'Person not found' });
        }

        // Ajoute "hamburger" à la liste des aliments préférés
        person.favoriteFoods.push("hamburger");

        // Sauvegarde la personne mise à jour
        await person.save();
        
        res.status(200).send({ msg: 'Food added successfully', data: person });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'An error occurred', error: error.message });
    }
});

//Exécuter de nouvelles mises à jour sur un document 

router.put('/update_age/:_name', async (req, res) => {
    try {
        const personName = req.params._name;

        // Find a person by their name and update their age
        const updatedPerson = await Person.findOneAndUpdate(
            { name: personName }, // Search criteria (use lowercase 'name')
            { age: 20 },          // Update operation (use lowercase 'age')
            { new: true }         // Return the updated document
        );

        // Check if the person was found and updated
        if (!updatedPerson) {
            return res.status(404).send({ msg: 'Person not found' });
        }

        // Return the updated person
        res.status(200).send({ msg: 'Age updated successfully', data: updatedPerson });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send({ msg: 'An error occurred', error: error.message });
    }
});

        

//Supprimer un document 


router.delete('/delate_person/:_id',async(req,res)=>{
    try{
        const{_id}=req.params;
        await Person.findOneAndDelete({_id})
        res.status(200).send({msg:'person delated',persondelated:_id})
        
    }catch(error){
        res.status(400).send({msg:'can not delate person'})

    }
    
})

router.delete('/delete-many/:_name', async (req, res) => {
    try {
        const { _name } = req.params;

        // Use deleteMany with the correct field name 'name'
        const result = await Person.deleteMany({ name: _name });

        if (result.deletedCount === 0) {
            return res.status(404).send({ msg: 'No persons found with the specified name', name: _name });
        }

        res.status(200).send({ msg: 'Persons deleted successfully', deletedCount: result.deletedCount, name: _name });
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: 'An error occurred', error: error.message });
    }
});




// Aides à la recherche de chaîne pour affiner les résultats


router.get('/food/:_favoriteFoods', async (req, res) => {
    try {
        const favoriteFood = req.params._favoriteFoods; // Get the food from the params

        // Use async/await to execute the query
        const people = await Person.find({ favoritefoods: favoriteFood }) // Search by food
            .sort({ name: 1 }) // Sort by the 'name' field (ascending order)
            .limit(2) // Limit the results to 2 documents
            .select('-age'); // Hide the 'age' field

        // Check if people are found
        if (!people || people.length === 0) {
            return res.status(404).send({
                msg: `No persons found who like ${favoriteFood}`
            });
        }

        // Return the found people
        res.status(200).send({
            msg: `Persons found who like ${favoriteFood}`,
            data: people
        });

    } catch (error) {
        console.error(error);
        res.status(400).send({
            msg: 'An unexpected error occurred',
            error: error.message
        });
    }
});


module.exports= router