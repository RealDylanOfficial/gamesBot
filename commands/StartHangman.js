const { SlashCommandBuilder, Client, Collector } = require('discord.js')
const fs = require('fs')
const Discord = require("discord.js")

let Input = ""
//Ascii art by Chris Horton https://gist.github.com/chrishorton/8510732aa9a80a03c829b09f12e20d9c
let hangmen = [`
  +---+
  |   |
      |
      |
      |
      |
=========`, `
  +---+
  |   |
  O   |
      |
      |
      |
=========`, `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`, `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hangman')
		.setDescription('Starts a hangman game.')
		.addStringOption(option =>
			option.setName('against')
				.addChoices(
					{ name: 'computer', value: 'computer'},
					{ name: 'player', value: 'player'}
					)
				.setDescription('Who do you want to play against?')),
		
	async execute(interaction) {
		await interaction.reply('Starting game')
		console.log("hangman")

		//Gets the type of opponent the user specified in the command
		const against = interaction.options.data[0].value
		console.log(against)

		if (against == "computer"){
			console.log("against computer")
			vsComputer(interaction)

		}
		else if (against == "player"){
			console.log("against player")
			vsPlayer()
		}
		
	},
};


	function vsComputer(interaction){

		//Opens text file of potential words
		const words = fs.readFileSync(__dirname + "/../EnglishWords.txt", "utf-8").toString().split("\n")
		const rand = Math.floor(Math.random()*84092)
		const word = words[rand]
		console.log(word)

		let hangmanIndex = -1
		let guessedLetters = []
		let discovered = []
		for (let x of Array(word.length - 1).keys()) { //example: word=apple, loops through 0 to 4 inclusive
			discovered[x] = false

		}

		//Gets the id of guild member who ran the command
		//I use this as a mask so that only messages from this user are processed
		let player = interaction.member.id

		//defines filter (boolean function) for the input function
		//validates input and ensures it comes from the player
		function filter(m){
			//player check
			if (m.author.id != player){
				return false
			}
			//length check
			if (m.content.length != 1){
				return false
			}
			//type check
			if (m.content.match(/[a-z]/i) == null){
				return false
			}
			//logic check
			if (guessedLetters.includes(m.content) == true){
				return false
			}

			return true
		}

		////////////////////////////////////////////////////////////////////////////////////////

		const collector = interaction.channel.createMessageCollector({filter, time: 300000 });

			
		//console.log(collector)
		displayWord(word, discovered, interaction)
		collector.on('collect', m => {
			console.log(m)
			console.log(`Collected ${m.content}`)
			
			Input = m.content
			guessedLetters.push(Input)

			correct = false
			for (let x of Array(word.length - 1).keys()) { //example: word=apple, loops through 0 to 4 inclusive

				if (Input == word[x]){
					discovered[x] = true
					correct = true
				}
			}
			if (correct == false){
				hangmanIndex += 1
				interaction.channel.send(hangmen[hangmanIndex])
			}

			//Check for win or loss
			if (hangmanIndex >= 6){
				interaction.channel.send("You lose! The word was " + word)
			}
			let won = true
			for (x in discovered){
				console.log(x)
				if (discovered[x] == false){
					won = false
				}
			}
			if (won == true){
				console.log("win")
				interaction.channel.send("You win! The word was " + word)
				collector.stop()

			}


			
			displayWord(word, discovered, interaction)
		});



		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`)
			
		});
		
		////////////////////////////////////////////////////////////////////////////////////////


	}
		
	function vsPlayer(){

	
	}


	
	function displayWord(word, discovered, interaction){
		let output = ""
		for (let i = 0; i < word.length - 1; i++) {
			if (discovered[i] == true){
				output += (" " + word[i] + " ")
			}
			else{
            	output += " \\_ "
			}
		}
		console.log(output)
		interaction.channel.send(output)
	}

