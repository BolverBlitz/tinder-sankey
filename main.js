const showSankey = () => {
    document.getElementById("sankey_chart").style.display = "block";
    document.getElementById("pie_chart").style.display = "none";
    document.getElementById("activity_chart").style.display = "none";
    document.getElementById("message_chart").style.display = "none";
};

const showPieChart = () => {
    document.getElementById("sankey_chart").style.display = "none";
    document.getElementById("pie_chart").style.display = "block";
    document.getElementById("activity_chart").style.display = "none";
    document.getElementById("message_chart").style.display = "none";
};

const showActivityChart = () => {
    document.getElementById("sankey_chart").style.display = "none";
    document.getElementById("pie_chart").style.display = "none";
    document.getElementById("activity_chart").style.display = "block";
    document.getElementById("message_chart").style.display = "none";
};

const showMessageChart = () => {
    document.getElementById("sankey_chart").style.display = "none";
    document.getElementById("pie_chart").style.display = "none";
    document.getElementById("activity_chart").style.display = "none";
    document.getElementById("message_chart").style.display = "block";
};

const dragOverHandler = (event) => event.preventDefault();
const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

const prepareData = (dataObject, name, color) => {
    return {
        type: 'scatter',
        mode: 'lines',
        x: Object.keys(dataObject),
        y: Object.values(dataObject),
        line: { color: color },
        name: name
    };
}

const generateURLWithBase64 = (Usage) => {
    const baseURL = window.location.origin + window.location.pathname;
    const { matches, messages_received, messages_sent, superlikes, swipes_likes, swipes_passes } = Usage;
    const data = {
        swipes_passes_num: sumValues(swipes_passes),
        swipes_likes_num: sumValues(swipes_likes),
        superlikes_num: sumValues(superlikes),
        matches_num: Number(sumValues(matches)) - Number(document.getElementById("ad_match").value) || 0 + Number(document.getElementById("fake_match").value) || 0,
        messages_received_num: sumValues(messages_received),
        messages_sent_num: sumValues(messages_sent),
        messages_total_num: Number(sumValues(messages_received)) + Number(sumValues(messages_sent)),
        one_date: document.getElementById("one_date").value || 0,
        multi_date: document.getElementById("multi_date").value || 0
    };

    const jsonString = JSON.stringify(data);
    const encodedData = btoa(encodeURIComponent(jsonString));

    console.log(`${baseURL}?data=${encodedData}`)
    window.location = `${baseURL}?data=${encodedData}`;
}

const getValuesFromBase64URL = () => {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('data');

    if (!encodedData) return null;

    const jsonString = decodeURIComponent(atob(encodedData));
    const values = JSON.parse(jsonString);

    return values;
}

const genCharts = (swipes_passes_num, swipes_likes_num, superlikes_num, matches_num, messages_sent_num, messages_received_num, messages_total_num, one_date, multi_date, Usage) => {

    const sankey_layout = {
        title: "Tinder Data Visualization",
        width: window.innerWidth,
        height: window.innerHeight - 200,
        font: {
            size: 14,
        },
    };

    let sankey_data_source = [];
    let sankey_data_target = [];
    let sankey_data_value = [];
    let sankey_data_label = [];
    let sankey_data_color = [];

    if (superlikes_num > 0) {
        sankey_data_source = [0, 0, 2, 4, 2, 3, 3, 5, 6, 7, 8];
        sankey_data_target = [1, 2, 4, 3, 3, 5, 6, 7, 7, 8, 9];
        sankey_data_value = [
            swipes_passes_num,
            swipes_likes_num,
            superlikes_num,
            matches_num,
            messages_total_num,
            messages_sent_num,
            messages_received_num,
            messages_sent_num,
            messages_received_num,
            one_date,
            multi_date,
        ];
        sankey_data_label = [
            "Total Swipes",
            "Passes",
            "Likes",
            "Matches",
            "Superlikes",
            "Msg Sent",
            "Msg Received",
            "MSG Total",
            "First Date",
            "❤️ More Dates",
        ];
        sankey_data_color = [
            "black",
            "red",
            "green",
            "yellow",
            "blue",
            "lightblue",
            "lightgreen",
            "gray",
            "lightcoral",
            "darkred",
        ];
    } else {
        sankey_data_source = [0, 0, 2, 3, 3, 4, 5, 4, 5, 7];
        sankey_data_target = [1, 2, 3, 4, 5, 6, 6, 7, 7, 8];
        sankey_data_value = [
            swipes_passes_num,
            swipes_likes_num,
            matches_num,
            messages_sent_num,
            messages_received_num,
            messages_sent_num,
            messages_received_num,
            one_date,
            one_date,
            multi_date,
        ];
        sankey_data_label = [
            "Total Swipes",
            "Passes",
            "Likes",
            "Matches",
            "Msg Sent",
            "Msg Received",
            "MSG Total",
            "First Date",
            "More Dates ❤️",
        ];
        sankey_data_color = [
            "black",
            "red",
            "green",
            "yellow",
            "lightblue",
            "lightgreen",
            "gray",
            "lightcoral",
            "darkred",
        ];
    }

    const sankey_data = [
        {
            type: "sankey",
            orientation: "h",

            node: {
                pad: 150,
                thickness: 50,
                line: {
                    color: "black",
                    width: 0.4,
                },
                label: sankey_data_label,
                color: sankey_data_color,
            },

            link: {
                color: "rgba(50, 50, 50, 0.4)",
                source: sankey_data_source,
                target: sankey_data_target,
                value: sankey_data_value,
            },
        },
    ];

    const pie_layout = {
        title: "Tinder Data Visualization",
        height: window.innerHeight - 200,
        width: window.innerWidth,
    };

    const pie_data = [
        {
            type: "pie",
            labels: [
                "Passes",
                "Likes",
                "Superlikes",
                "Matches",
                "First Date",
                "More Dates",
            ],
            values: [
                swipes_passes_num,
                swipes_likes_num,
                superlikes_num,
                matches_num,
                one_date,
                multi_date,
            ],
            textinfo: "label+percent",
            insidetextorientation: "radial",
            hole: 0.3, // Für ein Donut-Diagramm; entfernen oder auf 0 setzen für ein volles Kreisdiagramm
            marker: {
                colors: [
                    "red",
                    "green",
                    "blue",
                    "yellow",
                    "lightcoral",
                    "darkred",
                ],
            },
        },
    ];

    if (Usage) {
        const { matches, messages_received, messages_sent, superlikes, swipes_likes, swipes_passes } = Usage;
        const activity_layout = {
            title: 'Tinder Aktivitäten über die Zeit',
            height: window.innerHeight - 200,
            width: window.innerWidth,
            xaxis: {
                title: 'Datum',
                type: 'date'
            },
            yaxis: {
                title: 'Anzahl'
            }
        };

        const activity_data = [
            prepareData(matches, 'Matches', 'yellow'),
            prepareData(swipes_passes, 'Passes', 'red'),
            prepareData(swipes_likes, 'Likes', 'green'),
            prepareData(superlikes, 'Superlikes', 'blue')
        ];

        const message_layout = {
            title: 'Tinder Nachrichten über die Zeit',
            height: window.innerHeight - 200,
            width: window.innerWidth,
            xaxis: {
                title: 'Datum',
                type: 'date'
            },
            yaxis: {
                title: 'Anzahl der Nachrichten'
            }
        };

        const message_data = [
            prepareData(messages_sent, 'Gesendet', 'lightblue'),
            prepareData(messages_received, 'Empfangen', 'lightgreen')
        ];

        Plotly.newPlot('activity_chart', activity_data, activity_layout);
        Plotly.newPlot('message_chart', message_data, message_layout);
    }

    Plotly.newPlot("pie_chart", pie_data, pie_layout);
    Plotly.react("sankey_chart", sankey_data, sankey_layout);

};

const dropHandler = (event) => {
    event.preventDefault();
    for (const file of event.dataTransfer.files) {
        const reader = new FileReader();
        reader.onload = function (ev) {
            const { Usage, User } = JSON.parse(ev.target.result);
            //console.log(User.gender)
            document.title = `${User.name}'s Tinder Data`;

            const { matches, messages_received, messages_sent, superlikes, swipes_likes, swipes_passes } = Usage;
            const swipes_passes_num = sumValues(swipes_passes);
            const swipes_likes_num = sumValues(swipes_likes);
            const superlikes_num = sumValues(superlikes);
            // Matches to remove because they are either advertising for OnlyFans or fake profiles
            const rem_match = Number(document.getElementById("ad_match").value) || 0 + Number(document.getElementById("fake_match").value) || 0;
            const matches_num = Number(sumValues(matches)) - rem_match;
            const messages_received_num = sumValues(messages_received);
            const messages_sent_num = sumValues(messages_sent);
            const messages_total_num = messages_received_num + messages_sent_num;
            const one_date = document.getElementById("one_date").value || 0;
            const multi_date = document.getElementById("multi_date").value || 0;

            genCharts(swipes_passes_num, swipes_likes_num, superlikes_num, matches_num, messages_sent_num, messages_received_num, messages_total_num, one_date, multi_date, Usage);
            generateURLWithBase64(Usage);
        };

        document.getElementById("drop_zone").style.display = "none"; // Hide the drop zone
        document.getElementById("formSettings").style.display = "none"; // Show the settings

        // Show buttons
        document.getElementById("container").style.display = "block";

        // Hide Chart that are not on first page
        document.getElementById("pie_chart").style.display = "none";
        document.getElementById("activity_chart").style.display = "none";
        document.getElementById("message_chart").style.display = "none";
        reader.readAsText(file); // Read the file
    };
};

const dataFromURL = getValuesFromBase64URL();

if (dataFromURL) {
    const { matches_num, messages_received_num, messages_sent_num, superlikes_num, swipes_likes_num, swipes_passes_num, messages_total_num, one_date, multi_date } = dataFromURL;

    document.getElementById("drop_zone").style.display = "none"; // Hide the drop zone
    document.getElementById("formSettings").style.display = "none"; // Show the settings

    // Show buttons
    document.getElementById("container").style.display = "block";

    // Hide Chart that are not on first page
    document.getElementById("pie_chart").style.display = "none";
    document.getElementById("activity_chart").style.display = "none";
    document.getElementById("message_chart").style.display = "none";

    // Hide buttons for time charts
    document.getElementById("ActivityChart").style.display = "none";
    document.getElementById("MessageChart").style.display = "none";

    genCharts(swipes_passes_num, swipes_likes_num, superlikes_num, matches_num, messages_sent_num, messages_received_num, messages_total_num, one_date, multi_date);
}