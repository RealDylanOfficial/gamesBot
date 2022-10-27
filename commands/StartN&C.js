const { SlashCommandBuilder, Options } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('naughts-and-crosses')
		.setDescription('Starts a naughts and crosses game.')
		.addStringOption(option =>
			option.setName('against')
				.addChoices(
					{ name: 'computer', value: 'computer'},
					{ name: 'player', value: 'player'}
					)
				.setDescription('Who do you want to play against?')),
				
				

		
	async execute(interaction) {
		await interaction.reply('Starting game')
        console.log("naughts&crosses")


		//Gets the type of opponent the user specified in the command
		const against = interaction.options.data[0].value
		console.log(against)
		
		naughts_crosses(against)
		
		
	},
};

function naughts_crosses(Against){
	if (Against == "computer"){
		console.log("against computer")
	}
	else if (Against == "player"){
		console.log("against player")
	}
}