import { useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Map,
  ChevronDown,
  LocateFixed,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../common/Modal";
import Button from "../common/Button";

/* ──────────── Real Pakistani Public Service Offices ──────────── */
const OFFICES = [
  {
    id: 1,
    name: "NADRA Mega Center (Executive)",
    address: "Blue Area, Islamabad",
    hours: "Mon–Fri 8:00 AM – 4:00 PM",
    phone: "+92-51-111-786-100",
    gate: "Gate 2, Counter 5",
    lat: 33.7036,
    lng: 73.0551,
  },
  {
    id: 2,
    name: "Regional Passport Office",
    address: "G-10/4, Islamabad",
    hours: "Mon–Fri 8:30 AM – 3:00 PM",
    phone: "+92-51-9206890",
    gate: "Gate 1, Counter 3",
    lat: 33.7100,
    lng: 73.0350,
  },
  {
    id: 3,
    name: "Excise & Taxation Department",
    address: "H-9, Islamabad",
    hours: "Mon–Fri 9:00 AM – 3:00 PM",
    phone: "+92-51-9261314",
    gate: "Window 12",
    lat: 33.6800,
    lng: 73.0200,
  },
  {
    id: 4,
    name: "NADRA Registration Center",
    address: "Murree Road, Rawalpindi",
    hours: "Mon–Fri 8:00 AM – 4:00 PM",
    phone: "+92-51-4856789",
    gate: "Desk 4",
    lat: 33.5650,
    lng: 73.0160,
  },
];

/* ──────────── Helpers ──────────── */
const getGoogleMapsUrl = (name, address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, Pakistan`)}`;

const getEmbedUrl = (name, address) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(`${name} ${address}, Pakistan`)}&output=embed`;

const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getNearMeUrl = (lat, lng) =>
  `https://www.google.com/maps/search/NADRA+office+near+me/@${lat},${lng},13z`;

/* ──────────── Component ──────────── */
const OfficeFinder = ({ open, onClose }) => {
  const { theme } = useTheme();
  const [selectedOfficeMap, setSelectedOfficeMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const toggleMap = (id) => {
    setSelectedOfficeMap((prev) => (prev === id ? null : id));
  };

  /* Sort offices by distance if user location available */
  const sortedOffices = userLocation
    ? [...OFFICES].sort(
        (a, b) =>
          haversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) -
          haversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng),
      )
    : OFFICES;

  const getDistance = (office) => {
    if (!userLocation) return null;
    const km = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      office.lat,
      office.lng,
    );
    return km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(1)} km`;
  };

  /* Geolocation handler */
  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please enable it in browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("Unable to get your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setSelectedOfficeMap(null);
        onClose();
      }}
      title="Find Office & Token Times"
      width="max-w-xl"
    >
      <div className="flex flex-col gap-3">
        {/* Find Near Me button + Google Maps link */}
        <div className="flex items-center gap-2">
          <Button
            variant="teal"
            icon={
              locationLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LocateFixed size={14} />
              )
            }
            onClick={handleFindNearMe}
            disabled={locationLoading}
            className="hover:opacity-90 active:scale-95"
          >
            {locationLoading
              ? "Locating..."
              : userLocation
                ? "Sorted by Distance"
                : "Find Offices Near Me"}
          </Button>

          {userLocation && (
            <a
              href={getNearMeUrl(userLocation.lat, userLocation.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <Button
                variant="ghost"
                icon={<Map size={14} />}
                className="hover:opacity-90 active:scale-95"
              >
                Open in Google Maps
              </Button>
            </a>
          )}
        </div>

        {/* Location error */}
        {locationError && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
            style={{ background: theme.errorBg, color: theme.errorText }}
          >
            <AlertCircle size={14} />
            {locationError}
          </div>
        )}

        {/* Office cards */}
        {sortedOffices.map((office) => {
          const isMapOpen = selectedOfficeMap === office.id;
          const dist = getDistance(office);

          return (
            <div
              key={office.id}
              className="rounded-xl p-4"
              style={{
                background: theme.surfaceAlt,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: theme.text }}
                  >
                    {office.name}
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: theme.textMuted }}
                    >
                      <MapPin size={12} /> {office.address}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: theme.textMuted }}
                    >
                      <Clock size={12} /> {office.hours}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: theme.textMuted }}
                    >
                      <Phone size={12} /> {office.phone}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: theme.accent + "15", color: theme.accent }}
                    >
                      {office.gate}
                    </span>
                    {dist && (
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: "#22c55e18", color: "#22c55e" }}
                      >
                        📍 {dist}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                {/* Get Directions → Google Maps (Pakistan context) */}
                <a
                  href={getGoogleMapsUrl(office.name, office.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <Button
                    variant="teal"
                    icon={<Navigation size={14} />}
                    className="hover:opacity-90 active:scale-95"
                  >
                    Get Directions
                  </Button>
                </a>

                {/* View on Map → toggle iframe */}
                <Button
                  variant="ghost"
                  icon={<Map size={14} />}
                  onClick={() => toggleMap(office.id)}
                  className="hover:opacity-90 active:scale-95"
                >
                  {isMapOpen ? "Hide Map" : "View on Map"}
                  <ChevronDown
                    size={12}
                    className="transition-transform"
                    style={{
                      transform: isMapOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </Button>
              </div>

              {/* Embedded Google Maps iframe (Pakistan context) */}
              {isMapOpen && (
                <div
                  className="mt-3 overflow-hidden rounded-xl border"
                  style={{ borderColor: theme.border }}
                >
                  <iframe
                    title={`Map: ${office.name}`}
                    width="100%"
                    height="200"
                    className="border-0 w-full"
                    loading="lazy"
                    src={getEmbedUrl(office.name, office.address)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default OfficeFinder;
