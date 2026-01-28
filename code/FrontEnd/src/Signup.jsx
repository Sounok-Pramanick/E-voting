import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

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

const Signup = () => {
  const [formData, setFormData] = useState({
    voter_uid: '',
    aadhar_uid: '',
    name: '',
    dob: '',
    gender: '',
    father_or_husband_name: '',
    house_no: '',
    street_name: '',
    location: '',
    state: '',
    city: '',
    pincode: '',
    mob: '',
    email: '',
    constituency: '',
    assembly: '',
    ward_no: '',
    remarks: '',
  });

  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const navigate = useNavigate();

  const optionalFields = ['remarks', 'email'];

  useEffect(() => {
    if (error || success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['pincode', 'constituency', 'assembly', 'ward_no'];

    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? value.replace(/\D/g, '') : value
    });

    if (name === "state") {
      setCities(statesAndCities[value] || []);
      setFormData((prev) => ({ ...prev, city: "" }));
    }

    if (name === "mob") {
      checkMobileExists(value);
    }
  };

  const checkMobileExists = async (mob) => {
    if (!/^[0-9]{10}$/.test(mob)) {
      setMobileError("Mobile number must be exactly 10 digits.");
      return;
    }
    try {
      const response = await fetch("http://localhost/evoting/check_mobile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mob }),
      });
      const data = await response.json();
      if (data.exists) {
        setMobileError("This mobile number is already registered.");
      } else {
        setMobileError("");
      }
    } catch (err) {
      setMobileError("Could not verify mobile number. Try again.");
    }
  };

  const validateForm = () => {
    if (!/^[A-Za-z]{3}[0-9]{7}$/.test(formData.voter_uid)) {
      return "Voter UID must have first 3 letters and next 7 digits.";
    }
    if (!/^[0-9]{12}$/.test(formData.aadhar_uid)) {
      return "Aadhar UID must be exactly 12 digits.";
    }
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        if (age - 1 < 18) return "You must be at least 18 years old.";
      } else {
        if (age < 18) return "You must be at least 18 years old.";
      }
    } else {
      return "Date of Birth is required.";
    }
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      return "Pincode must be exactly 6 digits.";
    }
    if (!/^[0-9]{10}$/.test(formData.mob)) {
      return "Mobile number must be exactly 10 digits.";
    }
    if (mobileError) {
      return mobileError;
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsPreview(true);
  };

  const confirmSubmit = async () => {
    setError('');
    setSuccess('');

    const dataToSend = {
      ...formData,
      remarks: formData.remarks || null,
      email: formData.email || null
    };

    try {
      const response = await fetch('http://localhost/evoting/register_voter.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Registration successful!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.message || 'Registration failed.');
        setIsPreview(false);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      setIsPreview(false);
    }
  };

  return (
    <div className="signup-container">
      <button 
        className="back-btn"
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      <h1>New Voter Registration</h1>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {!isPreview ? (
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <label>Date of Birth<span style={{ color: 'red' }}>*</span></label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Gender<span style={{ color: 'red' }}>*</span></label>
            <div className="radio-group">
              <label>
                <input type="radio" name="gender" value="M" checked={formData.gender === "M"} onChange={handleChange}/> Male
              </label>
              <label>
                <input type="radio" name="gender" value="F" checked={formData.gender === "F"} onChange={handleChange}/> Female
              </label>
            </div>
          </div>

          {/* other fields */}
          {Object.keys(formData).map((field) => {
            if (field === "dob" || field === "gender") return null;
            if (field === "state") {
              return (
                <div key={field} className="input-group">
                  <label>STATE<span style={{ color: 'red' }}>*</span></label>
                  <select name="state" value={formData.state} onChange={handleChange} required>
                    <option value="">-- Select State --</option>
                    {Object.keys(statesAndCities).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              );
            }
            if (field === "city") {
              return (
                <div key={field} className="input-group">
                  <label>CITY<span style={{ color: 'red' }}>*</span></label>
                  <select name="city" value={formData.city} onChange={handleChange} required>
                    <option value="">-- Select City --</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              );
            }
            if (field === "mob") {
              return (
                <div key={field} className="input-group">
                  <label>MOBILE<span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="mob"
                    value={formData.mob}
                    onChange={handleChange}
                    required
                  />
                  {mobileError && <p className="error">{mobileError}</p>}
                </div>
              );
            }
            return (
              <div key={field} className="input-group">
                <label>
                  {field.replace(/_/g, ' ').toUpperCase()}
                  {!optionalFields.includes(field) && <span style={{ color: 'red' }}>*</span>}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={!optionalFields.includes(field)}
                />
              </div>
            );
          })}
          <button type="submit" className="submit-btn" disabled={!!mobileError}>Preview</button>
        </form>
      ) : (
        <div className="preview-container">
          <h2>Preview Your Details</h2>
          <p style={{color: 'red'}}><strong>Note:</strong> Once submitted finally, data cannot be changed.</p>
          <div className="preview-details">
            {Object.keys(formData).map((field) => (
              <p key={field}>
                <strong>{field.replace(/_/g, ' ').toUpperCase()}:</strong>{" "}
                {field === "gender"
                  ? formData.gender === "M" ? "Male" : formData.gender === "F" ? "Female" : "N/A"
                  : formData[field] || "N/A"}
              </p>
            ))}
          </div>
          <div className="preview-buttons">
            <button onClick={() => setIsPreview(false)} className="edit-btn">Go Back & Edit</button>
            <button onClick={confirmSubmit} className="confirm-btn" disabled={!!mobileError}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;