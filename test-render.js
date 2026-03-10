const http = require('http');

http.get('http://localhost:3000/en/scholarships', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Length:", data.length);
    console.log("Has 'Popular Only':", data.includes("Popular Only"));
    
    // Look closely for the checkbox or logic
    // We are looking for the exact text "No scholarships found"
    console.log("Has No Results:", data.includes("No scholarships found"));
    
    // Check if the script tags contain "is_popular":true inside self.__next_f
    console.log("Has is_popular:true in payload:", data.includes('"is_popular":true'));
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
