Step 1 — Entering the URL
When you open your browser and type in the Altener web app URL, the first thing you see is the public home page. You don't need to log in to view this page.
The top bar has the brand name "ALTENER" on the left. In the centre are navigation links — About, Models, Benefits, FAQ, and Contact — each of which smoothly scrolls you down to that section on the same page when clicked. On the centre you'll find a theme toggle icon (to switch between light and dark mode) and the Login button on right. As you scroll down the home page, you'll pass through the hero section, a savings calculator, product details, FAQs, and a contact form at the bottom.
________________________________________
Step 2 — Exploring vehicle models
As you scroll down, you reach the Models section. Here you'll see two vehicle model cards: BUZZ (heavy-duty) and LITE (light-duty). Click either card to open that model's full information page.
Inside the model page, you'll find a description of the vehicle, key features, and three variant tiles:
•	Flat-bed — open platform body, ideal for bulk goods
•	Low-deck — low-floor step frame, good for warehouse logistics
•	Container — enclosed box body for sealed or refrigerated cargo
Click any variant tile to see its dedicated page with full specifications — payload capacity, range, charge time, battery size, and recommended use case.
________________________________________
Step 3 — Switching between light and dark mode
At any point — on the home page, the login page, or inside the app — you can click the theme icon in the top bar (it looks like a sun or moon depending on your current mode). This instantly switches the entire app between light and dark appearance. Your preference is saved and remembered the next time you visit.
________________________________________
Step 4 — Logging in
Click the Login button in the top bar. You are taken to the sign-in page.
 The login page, type your registered email address in the first field and your password in the second. Then click Sign in. If your credentials are correct, you are taken straight to the Fault Dashboard.
If you've forgotten your password, click the "Forgot password?" link below the password field. You'll be asked to enter your registered email. The app will send a 6-digit one-time password (OTP) to that email address. Open the email, copy the code, and enter it on the OTP screen. Once verified, you'll be prompted to set a new password. After saving, you're redirected back to the login page to sign in with your new credentials. The OTP expires after 10 minutes — if you miss it, simply click Resend to get a new one.
________________________________________
Step 5 — After login: the app layout
Once logged in, you'll notice the screen has two permanent parts that stay visible no matter which section you're in:
The top bar shows the brand name "ALTENER" on the left and your role badge on the right — this could say Admin, Dealer/ Service, Customer, or Financer. This badge tells you what level of access you have.
The left sidebar is your main navigation menu. It contains: Fault Dashboard, Vehicles, User Table, Vehicle Table, Trip Table, Analytics, Graph — and at the very bottom, a Theme toggle and a Logout button.
________________________________________
Step 6 — Fault Dashboard
This is the first screen you see after login. It gives a live overview of your entire assigned fleet, updating automatically every few seconds.
At the top of the main area you'll see five status tiles: Total Vehicles, Moving, Idle, Charging, and Parked — all showing live counts for your assigned fleet.
Beside that is the Fault Levels section, which breaks down active faults into five severity tiers — Level 1 (minimal) down to Level 5 (Critical). This gives you an instant sense of how serious the current issues are across your fleet.
Below the fault levels are two fault tables — one for Battery faults and one for Controller faults. Each row shows the vehicle ID, the specific fault code, and the severity level so you know exactly which vehicle needs attention.
________________________________________
Step 7 — Vehicles page
Click Vehicles in the sidebar. You'll see all vehicles assigned to your account displayed as individual cards. Each card shows the vehicle's name, registration number, and its current live status — Moving, Idle, Charging, or Parked.
To view detailed information about a specific vehicle, simply click its card. This opens the Vehicle Dashboard for that vehicle.
________________________________________
Step 8 — Vehicle Dashboard (detailed view)
When you click a vehicle card from the Vehicles page, you are taken to its full live dashboard. Here is exactly what you will see:
Top bar shows the vehicle ID (e.g. AS-0001), its registration number (KA 01 TC 025/2), two status tags — GPS and OFFLINE/ONLINE — and an ON button to remotely power the vehicle on or off. If the vehicle is currently offline, a black "Vehicle Offline" banner appears prominently below.
The dashboard is split into several panels:
Vehicle Info shows the controller fault status and battery fault status — both display "Good" when there are no active issues, or a fault description if something is wrong.
Performance shows a live speedometer (in kmph), the current RPM, the estimated range remaining (km), the trip distance for the current journey, and the total odometer reading.
Efficiency & Drive shows energy consumption in Watt-Hr per km, the current gear, the active drive mode (P / E / D / R — the highlighted one is currently engaged), the controller current in amps, road gradient, and the remaining energy in kWhr with a progress bar.
Battery shows a large circular charge gauge (e.g. 97%), live current in amps, voltage, total charge cycles completed, power in watts, total capacity in AH, and balance capacity in AH.
Temperatures shows live readings for motor temperature, controller temperature, battery MOSFET temperature, and individual battery cell temperatures — all in °C with a colour bar indicating the level.
Cell Voltages shows the voltage of each individual battery cell (up to 24 cells). Cells highlighted in green are slightly higher than average; cells highlighted in red are below normal and may need attention.
Map shows the vehicle's live location on an interactive map (powered by MapmyIndia). You can zoom in, switch to 3D view, and see the exact location pin.
________________________________________
Step 9 — User Table
Click User Table in the sidebar. This page is only visible to Admin and Dealer roles — Customers and Financers will not see this option at all.
This page lists every user account within your management scope. For each user you can see their name, email address, assigned role, how many vehicles are linked to them, and whether their account is active. Clicking on any user row expands their full profile — contact details, their dealer group, and the specific vehicles assigned to them.
________________________________________
Step 10 — Vehicle Table
Click Vehicle Table in the sidebar. This is a spreadsheet-style list of all vehicles — one row per vehicle showing the ID, model, variant, registration number, and current status.
If you are an Admin or Dealer, you'll see an Add Vehicle button at the top to register a new vehicle into the system. Each existing row also has an Edit button to update that vehicle's details and a Parts button to open the service form for that vehicle. Always use the Parts button from this table — it pre-fills the form with the correct vehicle information automatically.
________________________________________
Step 11 — Trip Table
Click Trip Table in the sidebar. This shows a log of every completed trip across your fleet. Each row is one trip, showing the vehicle, date, start location, end location, total distance, energy consumed, and duration. Click any row to expand the full trip report — including a route replay on the map, speed profile throughout the journey, and any charging stops made along the way.
________________________________________
Step 12 — Analytics
Click Analytics in the sidebar. This screen shows detailed performance insights and charging session data for a specific vehicle on a specific date.
At the top right, use the Vehicle Number dropdown to select which vehicle you want to analyse, pick a date using the date picker, then click the green Submit button to load that vehicle's data.
The screen is divided into four sections:
Top summary card shows the current gear engaged and the active drive mode for the selected session.
Live metrics row displays eight key readings: Watt-Hour per km (energy efficiency), Speedometer (km/h), Battery SOC (state of charge in %), Controller Temperature (°C), Vehicle Weight (kg), Distance Travelled (km), Current (A), and Motor Temperature (°C).
Charging Session Details shows everything about the last charging session — the session start and end time, duration, SOC gained (percentage before and after charging), average current during charging, total AH charged, energy used in units, and a breakdown of temperatures during the session covering MOSFET, Charger, and four temperature sensor points (Temp-1 through Temp-4). A BMS Fault field is also shown at the bottom of this card.
Parameter table lists a full set of detailed technical readings in two columns — parameter name and its value. This includes gradient angle, ambient temperature, high and low voltage, AH consumed, battery cycles, battery fault code, controller fault code, controller current, max MOS temperature, and high and low cell voltage.
Map Routes shows the route the vehicle took on that date on an interactive MapmyIndia map, with zoom and 3D view controls.
Below the map are two charts:
WH/km Polar Chart — a circular radar-style chart that shows the average energy consumption (Watt-Hour per km) broken down for every 5 km segment of the trip. Each segment of the circle represents a 5 km stretch, and the size of the slice shows how efficiently the vehicle used energy during that portion of the journey. Larger slices mean higher energy consumption in that stretch; smaller slices mean the vehicle was more efficient.
SOC Breakdown Bar Chart — a bar chart that divides the trip into segments based on every 10% drop in battery State of Charge (SOC). For each 10% SOC band, the chart displays five values side by side: average current, average speed, average motor temperature, average controller temperature, and trip distance covered within that band. This lets you understand how the vehicle was being driven and how the components were performing at different battery levels throughout the journey.
________________________________________
Step 13 — Graph
Click Graph in the sidebar. This is a fully flexible charting tool. Use the three dropdowns at the top to choose:
•	What to plot — battery voltage, speed, motor temperature, energy consumption, and more
•	Time range —last 24 hours
•	Which vehicle — pick a specific vehicle
The chart updates instantly when you change any dropdown. This is the right place to investigate unusual patterns, compare two vehicles side by side, or check how a vehicle behaved during a specific trip window.
________________________________________
Logging out
When you're done, click Logout at the very bottom of the sidebar. This clears your session from the browser so no one else can access your account on the same device. You'll be taken back to the home page.

