import { Client, GatewayIntentBits, time } from 'discord.js';
import axios from 'axios';
import dotenv from "dotenv"
import cron from 'node-cron';

dotenv.config({
    path: "./.env"
})
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});



client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    let title = null;
    let date = null;
    let curDate = null;
    let time = null;
    // Function to be executed every 12 hours
    async function doSomething() {
        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/upcomingContest`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(result.data.data);
            title = result.data.data[0].title;
            date = result.data.data[0].date;
            time = result.data.data[0].time;
        } catch (error) {
            console.log(error);
        }

    }

    // Calculate the interval duration for 13 hours
    const intervalInMs = 13 * 60 * 60 * 1000; // 13 hours in milliseconds

    // Set up the setInterval to run the function every 13 hours
    setInterval(doSomething, intervalInMs);
    // Run the function immediately on startup
    await doSomething();







    let give = true;
    let ans = 'Some Issue Occur in  Leetcode Api';

    cron.schedule('* * * * *', async () => {

        let remDate = new Date();
        remDate.setUTCHours(remDate.getUTCHours() + 5);
        remDate.setUTCMinutes(remDate.getUTCMinutes() + 30);
        let [hours, minutes, seconds] = time.split(':').map(Number);
        let [datte, month, year] = date.split('/').map(Number);
        //   console.log(hours,minutes,seconds);
        //   console.log(remDate.getUTCDate());
        //   console.log(remDate.getUTCMonth()+1);
        //   console.log(remDate.getUTCFullYear());













        if (remDate.getUTCHours() === 7 && remDate.getUTCMinutes() === 0) {
            try {
                let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/problemoftheday`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                // console.log(result.data.content.activeDailyCodingChallengeQuestion.date);
                let resData = result.data.content.activeDailyCodingChallengeQuestion;
                ans = `Q-Name - ${resData.question.title}\n * Difficulty-level - ${resData.question.difficulty}\n * Acceptance-Rate - ${parseInt(resData.question.acRate)}%\n * Problem-Link - https://leetcode.com${resData.link}`;

            } catch (error) {
                console.log(error);
            }
        }

        if (remDate.getUTCHours() === 8 && remDate.getUTCMinutes() === 0) {
            let channel = client.channels.cache.get(process.env.CHANNEL_ID);
            if (channel) {
                channel.send(`@everyone Good Morning ... \n \n ----Aaj ka Leetcode POTD---- \n \n * -> ${ans}`);
            }
        }


        if (remDate.getUTCHours() === hours - 2 && remDate.getUTCMinutes() === minutes + 15 && remDate.getUTCDate() === datte && remDate.getUTCMonth() + 1 === month && remDate.getUTCFullYear() === year) {
            let channel = client.channels.cache.get(process.env.CHANNEL_ID);
            if (channel) {
                channel.send(`@everyone  \n \n # ${title}\n -> Time - At ${hours + 5 + ((minutes + 30) % 60 == 0)}:${(minutes + 30) % 60}0 ${hours <= 12 ? 'AM' : 'PM'} \n -> Date - ${datte}/${month}/${year}`);
            }
        }










    });

});



client.on("messageCreate", async (message) => {
    // console.log(message);
    // console.log(message.content);

    let currentDate = new Date();
    let currentTime = currentDate.toLocaleTimeString();
    let scheduledTime = new Date("2024-06-30T08:43:00").getTime() - Date.now();




    if (message.author.bot) return;
    console.log(message.message);
    if (message.content === 'Hi' || message.content === 'Hello' || message.content === 'hi' || message.content === 'hello') {
        message.reply({
            content: "Rom Rom Bhaiyo........",
        })
    }
    let str = message.content;
    let strArray = str.split(" ");
    // console.log(strArray[0]);
    // console.log(strArray[1]);
    if (strArray.length > 1 && strArray[0] === ';lcprofile') {
        try {
            let result = await axios.get(`https://alfa-leetcode-api.onrender.com/${strArray[1]}/contest`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
             console.log(result.data);
            message.reply({
                content: "Handle Name - " + `${strArray[1]}` + '\n' +
                    "Total Contest -" + `${result.data.contestAttend}` + '\n' +
                    "Contest Rating - " + `${result.data.contestRating}` + '\n' +
                    "Contest Top Percenteage - " + `${result.data.contestTopPercentage}%`+
                    `${result.data.contestBadges ? ("\nBadge - "+result.data.contestBadges.name):""}`,
            })


        } catch (error) {
            message.reply({
                content: "Invalid User",
            })
        }
    }


    if (strArray.length > 1 && strArray[0] == ';setreminder') {
        let time = strArray[1];
        let replyAns = `Reminder\n`;
        for (let i = 2; i < strArray.length; i++) {
            replyAns += strArray[i] + ' ';
        }

        function getSecondsDifference(time) {
            // Split the input time into hours and minutes
            let [hours, minutes] = time.split(':').map(Number);

            // Create a new Date object for the current time
            let now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);

            // Create a Date object for the given time today
            let givenTime = new Date(now);
            givenTime.setHours(hours, minutes, 0, 0);

            // Calculate the difference in milliseconds
            let diffInMillis = givenTime - now;

            // Convert the difference to seconds
            let diffInSeconds = Math.floor(diffInMillis / 1000);

            return diffInSeconds;
        }


        let diffInSeconds = getSecondsDifference(time);

        //   console.log(diffInSeconds);
        //   console.log(message);

        setTimeout(() => {
            message.reply({
                content: replyAns,
            });
        }, diffInSeconds * 1000);
    }

    if (strArray[0] === ';getavatar') {
        message.reply({
            content: message.author.displayAvatarURL({ format: 'png', dynamic: true }),
        });
    }

    if(strArray[0] === ';lcupcome'){

         try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/upcomingContest`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            message.reply({
                content:`${result.data.data[0].title} - ( ${result.data.data[0].date} ) \n  ${result.data.data[1].title} -  ( ${result.data.data[1].date})`
            })

         } catch (error) {
             console.log(error);
             message.reply({
                content:"Some Error Occur in Leetcode Api"
             })
         }

        
    }

    if (strArray[0] === ';potd') {
        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/problemoftheday`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
    
            console.log(result.data.content.activeDailyCodingChallengeQuestion.date);
            let resData = result.data.content.activeDailyCodingChallengeQuestion;
            message.reply({
                content:`* Q-Name - ${resData.question.title}\n* Difficulty-level -  ${resData.question.difficulty }\n* Acceptance-Rate -  ${parseInt(resData.question.acRate)} % \n* Problem-Link - https://leetcode.com${resData.link}`
            })
        } catch (error) {
            message.reply({content:"Some Issue occurs in Leetcode Api"})
        }
        
       
    }

    if (strArray[0] === ';userstat') {

        if(strArray.length!=2){
            message.reply({
                content:"Invalid Command , Check out ;help"
            })
        }
       
        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/username/${strArray[1]}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            let resData = result.data.content.matchedUser.submitStats.acSubmissionNum;

            let ans=`User Name -  ${strArray[1]} \n -> Total Problem Solved - ${resData[0].count} \n-> Easy Problem Solved - ${resData[1].count} \n-> Medium Problem Solved - ${resData[2].count} \n-> Hard Problem Solved -  ${resData[3].count}`
           
            if(strArray[1] !== undefined){
            message.reply({
                content:ans
            })
            }
        } catch (err) {
           // console.log('rom rom');
         //  console.log(err);
           message.reply({
            content:`Rom Rom Sir \nInvalid UserName Try Out Again`
           })
        }

    }


    if (strArray[0] === ';recaccepted') {

        if(strArray.length<2){
            message.reply({
                content:'Please Enter Username'
            })
        }else if(strArray.length<3){
            message.reply({
                content:'Please Enter Total no of recent accepted Solution you want'
            })
        }else if(strArray.length>3){
            message.reply({
                content:'Invalid command , Wants Help Please Type ;help to check valid commands'
            })
        }
  
        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/recentac/${strArray[1]}/${strArray[2]}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })


            let resData = result.data.content.recentAcSubmissionList;
            let advancedString = `* Recent Solved Problems by ${strArray[1]}\n \n`;
            let cnt = 1;
            resData.forEach(element => {
                advancedString += `-> ${cnt}. ${element.title}\nProblem_Link - https://leetcode.com/problems/${element.titleSlug}/description/\n \n`;
                cnt++;
            });
            if(strArray[1] !== undefined){
            message.reply({
                content:advancedString
            })
            }
        } catch (error) {
        
            message.reply({
                content:"Invalid User, Try it again!"
            })
        }

    }


    if (strArray[0] === ';conteststat') {

        if(strArray.length!=3){
            message.reply({
                content:"Invalid Command , Check out ;help"
            })
        }

        const input1 = strArray[1];
        const input2 = strArray[2];


        if(strArray.length<2){
            message.reply({
                content:'Please Enter Username'
            })
        }else if(strArray.length<3){
            message.reply({
                content:'Please Enter Total no of recent contest you want'
            })
        }else if(strArray.length>3){
            message.reply({
                content:'Invalid command , Wants Help Please Type ;help to check valid commands'
            })
        }

        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/conteststat/${input1}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })


            let resData = result.data.content;
            let userRanking = resData.userContestRanking;
            let userRecentContest = resData.userContestRankingHistory;
             //console.log(userRecentContest);
            let val = input2;
            let rankingListLength = userRecentContest.length;
            //    console.log(rankingListLength);
            let ansString = `Recent Contest of ${input1}\n`;
            let cnt = 1;
            for (let i = rankingListLength - 1; i >= 0 && val>0; i--) {
                if (userRecentContest[i].attended) {
                    val--;
                    const totalSeconds = userRecentContest[i].finishTimeInSeconds;

                    // Calculate hours
                    const hours = Math.floor(totalSeconds / 3600);

                    // Calculate remaining minutes
                    const minutes = Math.floor((totalSeconds % 3600) / 60);

                    // Calculate remaining seconds
                    const seconds = totalSeconds % 60;
                    ansString += `${cnt}. ${userRecentContest[i].contest.title}\n-> Rating - ${userRecentContest[i].rating}\n-> Ranking - ${userRecentContest[i].ranking}\n-> Problem_Solved - ${userRecentContest[i].problemsSolved}/${userRecentContest[i].totalProblems}\n-> Rating_Trend - ${userRecentContest[i].trendDirection}\n-> Finish_Time - ${hours} hours, ${minutes} minutes, and ${seconds} seconds\n \n`;
                    cnt++;
                }

            }
            if(input !== undefined){
            message.reply({
                content:ansString
            })
            }

        } catch (error) {
            message.reply({
                content:"Invalid User, Try it again!"
            })
            
        }

    }


    if (strArray[0] === ';skillstat') {

        if(strArray.length!=2){
            message.reply({
                content:"Invalid Command , Check out ;help"
            })
        }
        const input = strArray[1];
        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/skillstat/${input}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })


            let topicObj = result.data.content.matchedUser.tagProblemCounts
            let advanced = topicObj.advanced;
            let intermediate = topicObj.intermediate;

            let fundamental = topicObj.fundamental;
            // console.log(advanced);
            // let myReply=null;
            let advancedString = '';
            advanced.forEach(element => {
                advancedString += `${element.tagName} - ${element.problemsSolved}\n`;
                // console.log(element.tagName);
            });
            let intermediateString = '';
            intermediate.forEach(element => {
                intermediateString += `${element.tagName} - ${element.problemsSolved}\n`;
                // console.log(element.tagName);
            });

            let fundamentalString = '';
            fundamental.forEach(element => {
                fundamentalString += `${element.tagName} - ${element.problemsSolved}\n`;
                // console.log(element.tagName);
            });
           if(input !== undefined){
            message.reply(
                {content:`Username - ${input} \n--Topic wise problem solved---\n * 1. Advanced Topics -> \n${advancedString} \n * 2. Intermediate Topics -> \n${intermediateString} \n * 3. Fundamental Topics -> \n${fundamentalString}`
            })
            }
        } catch (error) {
            message.reply({content:"Invalid User, Try it again!"});
        }
    }

});








client.on("interactionCreate", async interaction => {
    console.log(interaction);
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    if (interaction.commandName === 'lcupcome') {

        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/upcomingContest`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            // console.log(result.data.data);
            await interaction.reply(result.data.data[0].title + ' - (' + result.data.data[0].date + ')' + '\n' + result.data.data[1].title + ' -  (' + result.data.data[1].date + ')');


        } catch (error) {
            console.log(error);
        }

        // await interaction.reply('LC Weekly contest!');
    }

    if (interaction.commandName === 'potd') {
        let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/problemoftheday`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        console.log(result.data.content.activeDailyCodingChallengeQuestion.date);
        let resData = result.data.content.activeDailyCodingChallengeQuestion;
        await interaction.reply('* Q-Name - ' + resData.question.title + '\n' + '* Difficulty-level - ' + resData.question.difficulty + '\n' + '* Acceptance-Rate - ' + parseInt(resData.question.acRate) + '%' + '\n' + '* Problem-Link - ' + 'https://leetcode.com' + resData.link);
    }

    if (interaction.commandName === 'userstat') {
        const input = interaction.options.getString('input');
        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/username/${input}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            let resData = result.data.content.matchedUser.submitStats.acSubmissionNum;

            await interaction.reply('User Name - ' + `${input}` + '\n' + '-> Total Problem Solved - ' + resData[0].count + '\n' +
                '-> Easy Problem Solved - ' + resData[1].count + '\n' +
                '-> Medium Problem Solved - ' + resData[2].count + '\n' +
                '-> Hard Problem Solved - ' + resData[3].count
            );
        } catch (err) {
            await interaction.reply("Invalid User, Try it again!");
        }

    }

    if (interaction.commandName === 'skillstat') {
        const input = interaction.options.getString('input');
        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/skillstat/${input}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })


            let topicObj = result.data.content.matchedUser.tagProblemCounts
            let advanced = topicObj.advanced;
            let intermediate = topicObj.intermediate;

            let fundamental = topicObj.fundamental;
            // console.log(advanced);
            // let myReply=null;
            let advancedString = '';
            advanced.forEach(element => {
                advancedString += `${element.tagName} - ${element.problemsSolved}\n`;
                // console.log(element.tagName);
            });
            let intermediateString = '';
            intermediate.forEach(element => {
                intermediateString += `${element.tagName} - ${element.problemsSolved}\n`;
                // console.log(element.tagName);
            });

            let fundamentalString = '';
            fundamental.forEach(element => {
                fundamentalString += `${element.tagName} - ${element.problemsSolved}\n`;
                // console.log(element.tagName);
            });

            await interaction.reply(`Username - ${input} \n--Topic wise problem solved---\n * 1. Advanced Topics -> \n${advancedString} \n * 2. Intermediate Topics -> \n${intermediateString} \n * 3. Fundamental Topics -> \n${fundamentalString}`);
        } catch (error) {
            await interaction.reply("Invalid User, Try it again!");
        }
    }

    if (interaction.commandName === 'recaccepted') {
        const input1 = interaction.options.getString('input1');
        const input2 = interaction.options.getString('input2');
        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/recentac/${input1}/${input2}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })


            let resData = result.data.content.recentAcSubmissionList;
            let advancedString = `* Recent Solved Problems by ${input1}\n \n`;
            let cnt = 1;
            resData.forEach(element => {
                advancedString += `-> ${cnt}. ${element.title}\nProblem_Link - https://leetcode.com/problems/${element.titleSlug}/description/\n \n`;
                cnt++;
            });

            await interaction.reply(advancedString);
        } catch (error) {
            await interaction.reply("Invalid User, Try it again!");
        }

    }

    if (interaction.commandName === 'conteststat') {
        const input1 = interaction.options.getString('input1');
        const input2 = interaction.options.getString('input2');
        try {
            let result = await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/conteststat/${input1}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })


            let resData = result.data.content;
            let userRanking = resData.userContestRanking;
            let userRecentContest = resData.userContestRankingHistory;
            // console.log(userRecentContest);
            let val = input2;
            let rankingListLength = userRecentContest.length;
            //    console.log(rankingListLength);
            let ansString = `Recent Contest of ${input1}\n`;
            let cnt = 1;
            for (let i = rankingListLength - 1; i >= 0 && val--; i--) {
                if (userRecentContest[i].attended) {
                    const totalSeconds = userRecentContest[i].finishTimeInSeconds;

                    // Calculate hours
                    const hours = Math.floor(totalSeconds / 3600);

                    // Calculate remaining minutes
                    const minutes = Math.floor((totalSeconds % 3600) / 60);

                    // Calculate remaining seconds
                    const seconds = totalSeconds % 60;
                    ansString += `${cnt}. ${userRecentContest[i].contest.title}\n-> Rating - ${userRecentContest[i].rating}\n-> Ranking - ${userRecentContest[i].ranking}\n-> Problem_Solved - ${userRecentContest[i].problemsSolved}/${userRecentContest[i].totalProblems}\n-> Rating_Trend - ${userRecentContest[i].trendDirection}\n-> Finish_Time - ${hours} hours, ${minutes} minutes, and ${seconds} seconds\n \n`;
                    cnt++;
                }

            }
            await interaction.reply(ansString);

        } catch (error) {
            await interaction.reply("Invalid User, Try it again!");
        }

    }

})
// Error handling and reconnection
client.on('error', console.error);
client.on('warn', console.warn);

client.on('shardError', error => {
    console.error('A websocket connection encountered an error:', error);
});

client.on('shardDisconnect', (event, id) => {
    console.log(`Shard ${id} disconnected`, event);
    // Attempt to reconnect
    client.login(process.env.TOKEN);
});

client.login(
    process.env.TOKEN
)