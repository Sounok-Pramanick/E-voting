import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateExpiry.css';

const UpdateExpiry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    voter_uid: '',
    aadhar_uid: '',
    mob: ''
  });
  const [voterData, setVoterData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const statesAndCities = {
    "Andhra Pradesh": [
        "Araku", "Srikakulam", "Vizianagaram", "Visakhapatnam", "Anakapalli",
        "Kakinada", "Amalapuram", "Rajahmundry", "Narasapuram", "Eluru",
        "Machilipatnam", "Vijayawada", "Guntur", "Narasaraopet", "Bapatla",
        "Ongole", "Nandyal", "Kurnool", "Anantapur", "Hindupur", "Kadapa",
        "Nellore", "Tirupati", "Chittoor"
    ],
    "Arunachal Pradesh": ["Arunachal West", "Arunachal East"],
    "Assam": [
        "Karimganj", "Silchar", "Autonomous District", "Dhubri",
        "Kokrajhar", "Barpeta", "Gauhati", "Mangaldoi", "Tezpur",
        "Nowgong", "Kaliabor", "Jorhat", "Dibrugarh", "Lakhimpur"
    ],
    "Bihar": [
        "Valmiki Nagar", "Paschim Champaran", "Purvi Champaran", "Sheohar", "Sitamarhi",
        "Madhubani", "Jhanjharpur", "Supaul", "Araria", "Kishanganj",
        "Katihar", "Purnia", "Madhepura", "Darbhanga", "Muzaffarpur",
        "Vaishali", "Gopalganj", "Siwan", "Maharajganj", "Saran",
        "Hajipur", "Ujiarpur", "Samastipur", "Begusarai", "Khagaria",
        "Bhagalpur", "Banka", "Munger", "Nalanda", "Patna Sahib",
        "Pataliputra", "Arrah", "Buxar", "Sasaram", "Karakat", "Aurangabad",
        "Gaya", "Nawada", "Jamui"
    ],
    "Chhattisgarh": [
        "Surguja", "Raigarh", "Janjgir", "Korba", "Bilaspur",
        "Rajnandgaon", "Durg", "Raipur", "Mahasamund", "Bastar", "Kanker"
    ],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": [
        "Kachchh", "Banaskantha", "Patan", "Mahesana", "Sabarkantha",
        "Gandhinagar", "Ahmedabad East", "Ahmedabad West", "Surendranagar",
        "Rajkot", "Porbandar", "Jamnagar", "Junagadh", "Amreli", "Bhavnagar",
        "Anand", "Kheda", "Panchmahal", "Dahod", "Vadodara", "Chhota Udaipur",
        "Bharuch", "Bardoli", "Surat", "Valsad"
    ],
    "Haryana": [
        "Ambala", "Kurukshetra", "Karnal", "Sonipat", "Rohtak", "Hisar",
        "Sirsa", "Bhiwani-Mahendragarh", "Gurgaon", "Faridabad"
    ],
    "Himachal Pradesh": ["Kangra", "Mandi", "Hamirpur", "Shimla"],
    "Jharkhand": [
        "Rajmahal", "Dumka", "Godda", "Chatra", "Kodarma", "Hazaribagh",
        "Ranchi", "Khunti", "Lohardaga", "Palamu", "Singhbhum", "Jamshedpur", "Dhanbad", "Giridih"
    ],
    "Karnataka": [
        "Chikkodi", "Belgaum", "Bagalkot", "Bijapur", "Gulbarga", "Raichur",
        "Koppal", "Bellary", "Bidar", "Haveri", "Dharwad", "Uttara Kannada",
        "Shimoga", "Davangere", "Chitradurga", "Tumkur", "Mandya",
        "Mysore", "Chamarajanagar", "Hassan", "Udupi Chikmagalur", "Dakshina Kannada",
        "Bangalore Rural", "Bangalore North", "Bangalore Central", "Bangalore South", "Chikkaballapur", "Kolar"
    ],
    "Kerala": [
        "Kasaragod", "Kannur", "Vatakara", "Kozhikode", "Wayanad",
        "Malappuram", "Ponnani", "Alathur", "Palakkad", "Thrissur",
        "Chalakudy", "Ernakulam", "Idukki", "Kottayam", "Alappuzha",
        "Mavelikkara", "Pathanamthitta", "Kollam", "Attingal", "Thiruvananthapuram"
    ],
    "Madhya Pradesh": [
        "Morena", "Bhind", "Gwalior", "Guna", "Sagar", "Tikamgarh",
        "Damoh", "Khajuraho", "Satna", "Rewa", "Sidhi", "Shahdol",
        "Jabalpur", "Mandla", "Balaghat", "Chhindwara", "Hoshangabad",
        "Betul", "Vidisha", "Bhopal", "Rajgarh", "Dewas", "Ujjain",
        "Mandsaur", "Ratlam", "Dhar", "Indore", "Khargone", "Khandwa"
    ],
    "Maharashtra": [
        "Nandurbar", "Dhule", "Jalgaon", "Raver", "Buldhana", "Akola",
        "Amravati", "Wardha", "Nagpur", "Ramtek", "Bhandara-Gondiya",
        "Gadchiroli-Chimur", "Chandrapur", "Yavatmal-Washim", "Hingoli",
        "Nanded", "Parbhani", "Jalna", "Aurangabad", "Dindori", "Nashik",
        "Palghar", "Bhiwandi", "Kalyan", "Thane", "Mumbai North", "Mumbai North West",
        "Mumbai North East", "Mumbai North Central", "Mumbai South Central", "Mumbai South",
        "Raigad", "Maval", "Pune", "Baramati", "Shirur", "Ahmednagar",
        "Shirdi", "Beed", "Osmanabad", "Latur", "Solapur", "Madha", "Sangli",
        "Satara", "Ratnagiri-Sindhudurg", "Kolhapur", "Hatkanangle"
    ],
    "Manipur": ["Inner Manipur", "Outer Manipur"],
    "Meghalaya": ["Shillong", "Tura"],
    "Mizoram": ["Mizoram"],
    "Nagaland": ["Nagaland"],
    "Odisha": [
        "Bargarh", "Sundargarh", "Sambalpur", "Keonjhar", "Mayurbhanj",
        "Balasore", "Bhadrak", "Jajpur", "Kendrapara", "Jagatsinghpur",
        "Cuttack", "Puri", "Bhubaneswar", "Aska", "Berhampur", "Kalahandi",
        "Nabarangpur", "Balangir", "Kandhamal"
    ],
    "Punjab": [
        "Gurdaspur", "Amritsar", "Khadoor Sahib", "Jalandhar", "Hoshiarpur",
        "Anandpur Sahib", "Ludhiana", "Fatehgarh Sahib", "Faridkot", "Firozpur",
        "Bathinda", "Sangrur", "Patiala"
    ],
    "Rajasthan": [
        "Ganganagar", "Bikaner", "Churu", "Jhunjhunu", "Sikar", "Jaipur Rural",
        "Jaipur", "Alwar", "Bharatpur", "Karauli-Dholpur", "Dausa", "Tonk-Sawai Madhopur",
        "Ajmer", "Nagaur", "Pali", "Jodhpur", "Barmer", "Jalore", "Udaipur",
        "Banswara", "Chittorgarh", "Rajsamand", "Bhilwara", "Kota", "Jhalawar-Baran"
    ],
    "Sikkim": ["Sikkim"],
    "Tamil Nadu": [
        "Thiruvallur", "Chennai North", "Chennai South", "Chennai Central", "Sriperumbudur",
        "Kanchipuram", "Arakkonam", "Vellore", "Krishnagiri", "Dharmapuri",
        "Tiruvannamalai", "Arani", "Viluppuram", "Kallakurichi", "Salem",
        "Namakkal", "Erode", "Tiruppur", "Nilgiris", "Coimbatore",
        "Pollachi", "Dindigul", "Karur", "Tiruchirappalli", "Perambalur",
        "Cuddalore", "Chidambaram", "Mayiladuthurai", "Nagapattinam",
        "Thanjavur", "Sivaganga", "Madurai", "Theni", "Virudhunagar",
        "Ramanathapuram", "Thoothukkudi", "Tirunelveli", "Kanyakumari"
    ],
    "Telangana": [
        "Adilabad", "Peddapalle", "Karimnagar", "Nizamabad", "Zahirabad",
        "Medak", "Malkajgiri", "Secunderabad", "Hyderabad", "Chevella",
        "Mahbubnagar", "Nagarkurnool", "Nalgonda", "Bhongir", "Warangal",
        "Mahabubabad", "Khammam"
    ],
    "Tripura": ["Tripura West", "Tripura East"],
    "Uttar Pradesh": [
        "Saharanpur", "Kairana", "Muzaffarnagar", "Bijnor", "Nagina",
        "Moradabad", "Rampur", "Sambhal", "Amroha", "Meerut", "Baghpat",
        "Ghaziabad", "Gautam Buddha Nagar", "Bulandshahr", "Aligarh", "Hathras",
        "Mathura", "Agra", "Fatehpur Sikri", "Firozabad", "Mainpuri", "Etah",
        "Badaun", "Aonla", "Bareilly", "Pilibhit", "Shahjahanpur", "Kheri",
        "Dhaurahra", "Sitapur", "Hardoi", "Misrikh", "Unnao", "Mohanlalganj",
        "Lucknow", "Rae Bareli", "Amethi", "Sultanpur", "Pratapgarh",
        "Kaushambi", "Phulpur", "Allahabad", "Fatehpur", "Banda", "Hamirpur",
        "Jalaun", "Jhansi", "Lalitpur", "Kanpur", "Akbarpur", "Farrukhabad",
        "Etawah", "Kannauj", "Auraiya", "Kanpur Dehat", "Barabanki",
        "Faizabad", "Ambedkar Nagar", "Bahraich", "Kaiserganj", "Gonda",
        "Domariyaganj", "Basti", "Sant Kabir Nagar", "Maharajganj",
        "Gorakhpur", "Kushi Nagar", "Deoria", "Ballia", "Ghazipur",
        "Chandauli", "Varanasi", "Mirzapur", "Robertsganj", "Bhadohi",
        "Jaunpur", "Machhlishahr"
    ],
    "Uttarakhand": ["Tehri Garhwal", "Garhwal", "Almora", "Nainital-Udhamsingh Nagar", "Haridwar"],
    "West Bengal": [
        "Cooch Behar", "Alipurduars", "Jalpaiguri", "Darjeeling", "Raiganj",
        "Balurghat", "Maldaha Uttar", "Maldaha Dakshin", "Jangipur", "Baharampur",
        "Murshidabad", "Krishnanagar", "Ranaghat", "Bangaon", "Barrackpore",
        "Dum Dum", "Barasat", "Basirhat", "Jaynagar", "Mathurapur",
        "Diamond Harbour", "Jadavpur", "Kolkata Dakshin", "Kolkata Uttar",
        "Howrah", "Uluberia", "Serampore", "Hooghly", "Arambagh",
        "Tamluk", "Kanthi", "Ghatal", "Jhargram", "Medinipur", "Purulia",
        "Bankura", "Bishnupur", "Asansol", "Bardhaman-Durgapur", "Bardhaman-Purba",
        "Bolpur", "Birbhum"
    ],
    "Andaman and Nicobar Islands": ["Andaman and Nicobar Islands"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli and Daman and Diu"],
    "Delhi": [
        "Chandni Chowk", "North East Delhi", "East Delhi", "New Delhi",
        "North West Delhi", "West Delhi", "South Delhi"
    ],
    "Jammu and Kashmir": ["Baramulla", "Srinagar", "Anantnag-Rajouri", "Udhampur", "Jammu"],
    "Ladakh": ["Ladakh"],
    "Lakshadweep": ["Lakshadweep"],
    "Puducherry": ["Puducherry"]
};


  // Derived options
  const stateOptions = useMemo(() => Object.keys(statesAndCities), []);
  const cityOptions = useMemo(() => {
    const st = voterData?.state;
    return st && statesAndCities[st] ? statesAndCities[st] : [];
  }, [voterData?.state]);

  // Handle search inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fetch voter by UID/Aadhaar/Mobile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setVoterData(null);

    const filled = Object.values(formData).filter((val) => val.trim() !== '');
    if (filled.length !== 1) {
      setError('Please fill only one field (voter_uid OR aadhar_uid OR mob).');
      return;
    }

    try {
      const response = await fetch('http://localhost/evoting/get_voter_expiry.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setVoterData(data.voter);
      } else {
        setError(data.message || 'Voter is not signed up.');
      }
    } catch (err) {
      setError('Error fetching data.');
    }
  };

  // Handle generic editing inputs
  const handleVoterChange = (e) => {
    setVoterData({
      ...voterData,
      [e.target.name]: e.target.value
    });
  };

  // Handle state -> city cascade
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setVoterData((prev) => {
      const prevCity = prev?.city || '';
      const validCities = statesAndCities[newState] || [];
      const cityStillValid = validCities.includes(prevCity);
      return {
        ...prev,
        state: newState,
        city: cityStillValid ? prevCity : ''
      };
    });
  };

  // Save changes
  const handleUpdate = async () => {
    try {
      const response = await fetch('http://localhost/evoting/update_voter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(voterData)
      });

      const data = await response.json();
      if (data.success) {
        alert('Voter details updated successfully ✅');
        // Reset to initial state (show "Check" form again)
        setVoterData(null);
        setFormData({ voter_uid: '', aadhar_uid: '', mob: '' });
        setMessage('');
        setError('');
      } else {
        setError(data.message || 'Update failed.');
        setMessage('');
      }
    } catch (err) {
      setError('Error updating voter.');
      setMessage('');
    }
  };

  return (
    <div className="update-expiry-container">
      <button 
        type="button" 
        className="back-btn" 
        onClick={() => navigate('/admin-login')}
      >
        ← Back
      </button>
      <h2>Check / Update Voter Details</h2>
      {!voterData && (
        <form onSubmit={handleSubmit}>
          <label>Voter UID</label>
          <input
            type="text"
            name="voter_uid"
            placeholder="Enter Voter UID"
            value={formData.voter_uid}
            onChange={handleChange}
          />
          <label>Aadhaar UID</label>
          <input
            type="text"
            name="aadhar_uid"
            placeholder="Enter Aadhaar UID"
            value={formData.aadhar_uid}
            onChange={handleChange}
          />
          <label>Mobile Number</label>
          <input
            type="text"
            name="mob"
            placeholder="Enter Mobile Number"
            value={formData.mob}
            onChange={handleChange}
          />
          <button className="save-btn" type="submit">Check</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {voterData && (
        <div className="result-box">
          <h3>Edit Voter Details</h3>

          <label>Voter UID</label>
          <input
            type="text"
            name="voter_uid"
            value={voterData.voter_uid || ''}
            onChange={handleVoterChange}
          />

          <label>Aadhaar UID</label>
          <input
            type="text"
            name="aadhar_uid"
            value={voterData.aadhar_uid || ''}
            onChange={handleVoterChange}
          />

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={voterData.name || ''}
            onChange={handleVoterChange}
          />

          <label>Age</label>
          <input
            type="number"
            name="age"
            value={voterData.age || ''}
            onChange={handleVoterChange}
          />

          <label>House No</label>
          <input
            type="text"
            name="house_no"
            value={voterData.house_no || ''}
            onChange={handleVoterChange}
          />

          <label>Street Name</label>
          <input
            type="text"
            name="street_name"
            value={voterData.street_name || ''}
            onChange={handleVoterChange}
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={voterData.location || ''}
            onChange={handleVoterChange}
          />

          <label>Pincode</label>
          <input
            type="number"
            name="pincode"
            value={voterData.pincode || ''}
            onChange={handleVoterChange}
          />

          <label>Remarks</label>
          <input
            type="text"
            name="remarks"
            value={voterData.remarks || ''}
            onChange={handleVoterChange}
          />

          <label>State</label>
          <select
            name="state"
            value={voterData.state || ''}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {stateOptions.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <label>City</label>
          <select
            name="city"
            value={voterData.city || ''}
            onChange={handleVoterChange}
            disabled={!voterData?.state}
          >
            <option value="">Select City</option>
            {cityOptions.map((ct) => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>

          <label>Mobile</label>
          <input
            type="text"
            name="mob"
            value={voterData.mob || ''}
            onChange={handleVoterChange}
          />

          <label>Constituency</label>
          <input
            type="number"
            name="constituency"
            value={voterData.constituency || ''}
            onChange={handleVoterChange}
          />

          <label>Assembly</label>
          <input
            type="number"
            name="assembly"
            value={voterData.assembly || ''}
            onChange={handleVoterChange}
          />

          <label>Ward No</label>
          <input
            type="number"
            name="ward_no"
            value={voterData.ward_no || ''}
            onChange={handleVoterChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={voterData.email || ''}
            onChange={handleVoterChange}
          />

          <label>Gender</label>
          <select
            name="gender"
            value={voterData.gender || ''}
            onChange={(e) =>
              setVoterData({
                ...voterData,
                gender: e.target.value
              })
            }
          >
            <option value="">Select Gender</option>
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>

          <label>Father / Husband Name</label>
          <input
            type="text"
            name="father_or_husband_name"
            value={voterData.father_or_husband_name || ''}
            onChange={handleVoterChange}
          />

          <label>Expiry Date</label>
          <input
            type="date"
            name="expiry"
            value={voterData.expiry || ''}
            onChange={handleVoterChange}
          />

          <label>Authenticated Initial</label>
          <input
            type="text"
            name="authenticated_initial"
            value={voterData.authenticated_initial || ''}
            onChange={handleVoterChange}
          />

          <button className="save-btn" type="button" onClick={handleUpdate}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default UpdateExpiry;
