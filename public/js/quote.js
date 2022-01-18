const area = document.getElementById('sanskar');
const auth = document.getElementById('rishabh');

const quotes = ["The people who push themselves into Hell see a different Hell from the rest of us. They see something beyond that Hell. Maybe it's hope, maybe it's yet another Hell. The only people who do know are the ones who keep moving forward", 
			"Those who do not fear the sword they wield, have no right to wield a sword at all", 
			"Laws only exist for those who cannot live without clinging to them",
			"I would never die for my beliefs because I might be wrong"]
const authors = ["Eren Yeager", "Kaname Tosen", "Sosuke Aizen", "Bertrand Russell"]

function days(date) {
    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;
	const date2 = new Date(2022, 1, 17);
    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date - date2);
    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);
} 

var today = new Date();
let index = days(today) % quotes.length;

area.innerText =  '"' + quotes[index] + '."'
auth.innerText = '- ' + authors[index] 

