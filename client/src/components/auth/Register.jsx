import React, { useState } from 'react';
import { Mail, Lock, Phone, Shield, Building, MapPin, Hash, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export default function Register({ switchToLogin }) {
  const [role, setRole] = useState('FAN'); 
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [userFields, setUserFields] = useState({
    email: '',
    phone_number: '',
    password: '',
  });

  const [clubFields, setClubFields] = useState({
    club_name: '',
    registration_number: '',
    county: '',
  });

  const handleUserChange = (e) => {
    setUserFields({ ...userFields, [e.target.name]: e.target.value });
    setErrorMsg(null);
  };

  const handleClubChange = (e) => {
    setClubFields({ ...clubFields, [e.target.name]: e.target.value });
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const isClubRegistration = role === 'CLUB_MANAGER';
    const endpoint = isClubRegistration ? `${API_BASE_URL}/register/club/` : `${API_BASE_URL}/register/`;

    // Construct Payload matching your Django Serializers
    let payload;
    if (isClubRegistration) {
      // Matches CustomClubRegistrationSerializer: { user: {...}, club: {...} }
      payload = {
        user: {
          email: userFields.email,
          phone_number: userFields.phone_number,
          password: userFields.password,
          role: 'CLUB_MANAGER'
        },
        club: {
          club_name: clubFields.club_name,
          registration_number: clubFields.registration_number,
          county: clubFields.county
        }
      };
    } else {
      // Matches CustomUserSerializer
      payload = {
        email: userFields.email,
        phone_number: userFields.phone_number,
        role: role,
        password: userFields.password,
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const firstErrorKey = Object.keys(data)[0];
        const errorText = Array.isArray(data[firstErrorKey]) 
          ? `${firstErrorKey}: ${data[firstErrorKey][0]}` 
          : typeof data[firstErrorKey] === 'object' 
            ? JSON.stringify(data[firstErrorKey]) 
            : data.detail || 'Registration failed.';
        throw new Error(errorText);
      }

      setSuccessMsg('Account registered successfully! Status set to PENDING awaiting Admin verification.');
      setTimeout(() => {
        switchToLogin();
      }, 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Create System Account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Register to participate in the FKF Analytics & Scouting Network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-slate-800 py-8 px-6 shadow-2xl rounded-xl border border-slate-700 sm:px-10">
          
          {successMsg && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-900/40 border border-emerald-500/50 flex items-start space-x-3 text-emerald-200 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/40 border border-red-500/50 flex items-start space-x-3 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: 'FAN', label: 'Fan' },
                  { id: 'COACH', label: 'Coach' },
                  { id: 'PLAYER', label: 'Player' },
                  { id: 'CLUB_MANAGER', label: 'Club Manager' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-colors ${
                      role === r.id
                        ? 'bg-amber-400 text-blue-950 border-amber-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Standard Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={userFields.email}
                    onChange={handleUserChange}
                    className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-amber-400 focus:border-amber-400"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="phone_number"
                    value={userFields.phone_number}
                    onChange={handleUserChange}
                    className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-amber-400 focus:border-amber-400"
                    placeholder="+254 700 000000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={userFields.password}
                  onChange={handleUserChange}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-amber-400 focus:border-amber-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Nested Fields for Club Managers */}
            {role === 'CLUB_MANAGER' && (
              <div className="p-4 bg-slate-900/80 rounded-xl border border-amber-400/30 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Club Details (Required for Managers)
                  </h4>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Club Name</label>
                  <input
                    type="text"
                    name="club_name"
                    required
                    value={clubFields.club_name}
                    onChange={handleClubChange}
                    placeholder="e.g., Gor Mahia FC"
                    className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Registration Reg No.</label>
                    <input
                      type="text"
                      name="registration_number"
                      required
                      value={clubFields.registration_number}
                      onChange={handleClubChange}
                      placeholder="FKF-REG-9912"
                      className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">County / Region</label>
                    <input
                      type="text"
                      name="county"
                      required
                      value={clubFields.county}
                      onChange={handleClubChange}
                      placeholder="e.g., Nairobi"
                      className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-950" />
              ) : (
                'Register Account'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={switchToLogin}
                className="font-bold text-amber-400 hover:underline focus:outline-none"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}