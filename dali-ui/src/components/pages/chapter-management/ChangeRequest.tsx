import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import DrawerContainer from "../../utils/DrawerContainer";
import styled from "styled-components";
import '@fortawesome/fontawesome-free/css/all.min.css';

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: 8px;
  color: #666;
  transition: all 0.2s ease;
  border-radius: 4px;
  
  i {
    font-size: 20px;
    transition: color 0.2s ease;
  }
  
  &:hover {
    background-color: rgb(200, 70, 100);
    transform: translateY(-1px);
    
    i {
      color: white;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ChangeRequest: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ChangeRequest page component mounted");

    // Prevent navigation to handbook
    // const preventNavigation = (event: PopStateEvent) => {
    //   console.log("Navigation prevented");
    //   event.preventDefault();
    //   navigate("/changeRequest", { replace: true });
    // };

    // window.history.pushState(null, "", "/changeRequest");
    // window.addEventListener("popstate", preventNavigation);

    // return () => {
    //   window.removeEventListener("popstate", preventNavigation);
    // };
  }, [navigate]);

  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const data = [
    {
      id: 1,
      title: "01. Planning process pending > Connections to the sewerage system",
      date: "December 18, 2024",
      description: ",udsrayt",
      status: "There are no new change requests",
      drawerContent: "In treatment: Own change",
      owner: "Saanvi Owner",
      details: {
        customRequirement: ",udsrayt",
        currentRequirement: "",
        location: {
          chapter: "Planning process pending",
          level: "Furnishing level",
          residentialArea: "All cores",
          area: "All areas",
          subject: "Connections to the sewerage system",
          subtopic: "Connection",
        },
        attachments: ["04.06 Long-term parking A4 Standing.pdf"],
        sourceReferences: ["Map of Rhineland"],
        hardness: "Norm (N)",
      },
    },
    {
      id: 2,
      title: "01. Planning process pending > Connection",
      date: "December 18, 2024",
      description: "This",
      status: "There are no new change requests",
      drawerContent: "In treatment: No changes",
      owner: "Rahul Kumar",
      details: {
        customRequirement: "Custom requirement content",
        currentRequirement: "Connection details here",
        location: {
          chapter: "Planning process pending",
          level: "Review level",
          residentialArea: "Area 1",
          area: "Sub-area 2",
          subject: "Connection maintenance",
          subtopic: "Review",
        },
        attachments: [],
        sourceReferences: ["Source A"],
        hardness: "High (H)",
      },
    },
    {
      id: 3,
      title: "01. Planning process pending > Sewer Maintenance",
      date: "January 10, 2025",
      description: "Planned maintenance for sewer system",
      status: "Change requests are pending",
      drawerContent: "Scheduled for review",
      owner: "Priya Sharma",
      details: {
        customRequirement: "Ensure proper maintenance procedures",
        currentRequirement: "Inspect sewer system thoroughly",
        location: {
          chapter: "Maintenance",
          level: "Inspection level",
          residentialArea: "Core A",
          area: "Central Sewer Area",
          subject: "Sewer Maintenance",
          subtopic: "Scheduled inspection",
        },
        attachments: ["Maintenance_Schedule.pdf"],
        sourceReferences: ["Map of Central Sewer Area"],
        hardness: "Moderate (M)",
      },
    },
    {
      id: 4,
      title: "02. Planning process approved > Water Supply System",
      date: "February 2, 2025",
      description: "Approval for water supply enhancements",
      status: "No change requests needed",
      drawerContent: "Approved and finalized",
      owner: "Akash Verma",
      details: {
        customRequirement: "Upgrade water pipelines",
        currentRequirement: "Install additional water tanks",
        location: {
          chapter: "Approval Process",
          level: "Infrastructure level",
          residentialArea: "All cores",
          area: "Water Supply Area",
          subject: "Pipeline Upgrades",
          subtopic: "Finalized installation",
        },
        attachments: ["Water_Pipeline_Upgrades.pdf"],
        sourceReferences: ["Water Supply Map"],
        hardness: "Low (L)",
      },
    },
    {
      id: 5,
      title: "03. Planning process review > Street Lighting",
      date: "March 5, 2025",
      description: "Review for street lighting improvements",
      status: "Pending review from authorities",
      drawerContent: "Awaiting review",
      owner: "Neha Gupta",
      details: {
        customRequirement: "Replace outdated streetlights",
        currentRequirement: "Install energy-efficient LED lighting",
        location: {
          chapter: "Lighting Review",
          level: "Infrastructure planning",
          residentialArea: "Urban Cores",
          area: "Streets and Pathways",
          subject: "Lighting Improvements",
          subtopic: "Energy efficiency upgrades",
        },
        attachments: ["LED_Lighting_Proposal.pdf"],
        sourceReferences: ["City Lighting Map"],
        hardness: "Moderate (M)",
      },
    },
    {
      id: 6,
      title: "04. Planning process pending > Public Park Enhancements",
      date: "April 10, 2025",
      description: "Enhancements planned for public parks",
      status: "Feedback pending",
      drawerContent: "Awaiting community feedback",
      owner: "Manish Kumar",
      details: {
        customRequirement: "Upgrade park amenities",
        currentRequirement: "Install additional benches and lights",
        location: {
          chapter: "Parks and Recreation",
          level: "Public infrastructure",
          residentialArea: "All cores",
          area: "Public Parks",
          subject: "Park Enhancements",
          subtopic: "Community feedback",
        },
        attachments: [],
        sourceReferences: ["Park Development Plan"],
        hardness: "Low (L)",
      },
    },
    {
      id: 7,
      title: "05. Planning process review > Drainage System",
      date: "May 20, 2025",
      description: "Drainage system review and upgrade",
      status: "Change requests under consideration",
      drawerContent: "Under review",
      owner: "Divya Sharma",
      details: {
        customRequirement: "Improve drainage efficiency",
        currentRequirement: "Install advanced drainage systems",
        location: {
          chapter: "Drainage Review",
          level: "Infrastructure enhancements",
          residentialArea: "Core C",
          area: "Low-lying areas",
          subject: "Drainage Upgrades",
          subtopic: "System efficiency improvements",
        },
        attachments: ["Drainage_Plan.pdf"],
        sourceReferences: ["Flood Risk Map"],
        hardness: "High (H)",
      },
    },
  ];
  

  

  const handleCardClick = (id: number) => {
    setActiveCardId(activeCardId === id ? null : id); // Toggle selection
  };

  const activeCard = data.find((card) => card.id === activeCardId);

  return (
    <Layout>
    <div style={styles.container}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        {data.map((card) => (
          <div key={card.id} style={styles.card} onClick={() => handleCardClick(card.id)}>
            <div style={styles.header}>{card.title}</div>
            <div style={styles.body}>
              <div style={styles.row}>
                <div style={styles.date}>{card.date}</div>
                <div style={styles.description}>{card.description}</div>
              </div>
              <div style={styles.status}>{card.status}</div>
            </div>
            {activeCardId === card.id && (
              <div style={styles.drawer}>
                <div style={styles.drawerContent}>
                  <div>✅ ❌ 👤 {card.drawerContent}</div>
                  <div style={styles.owner}>{card.owner}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={styles.rightSection}>
        {activeCard ? (
          <div>
            <div style={styles.sectionHeader}>
              <span style={{color:'white',backgroundColor:'#C84664',paddingLeft:'8px', paddingRight:'8px', paddingTop:'8px',paddingBottom:'8px' ,textAlign:'center'}}>Actions</span>
            </div>

            <div style={styles.contentSection}>
              <h3 style={styles.sectionTitle}>Custom requirement</h3>
              <p style={styles.value}>{activeCard.details.customRequirement}</p>
            </div>

            <div style={styles.contentSection}>
              <h3 style={styles.sectionTitle}>Current requirement</h3>
              <p style={styles.value}>{activeCard.details.currentRequirement}</p>
            </div>

            <div style={styles.contentSection}>
              <h3 style={styles.sectionTitle}>Location</h3>
              {Object.entries(activeCard.details.location).map(([key, value]) => (
                <div key={key} style={styles.infoRow}>
                  <span style={styles.label}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span style={styles.value}>{value}</span>
                </div>
              ))}
            </div>

            <div style={styles.contentSection}>
              <h3 style={styles.sectionTitle}>Attachments</h3>
              {activeCard.details.attachments.map((file, index) => (
                <div key={index} style={styles.infoRow}>
                  <span style={styles.value}>{file}</span>
                  <div>
                    <IconButton><i className="bi bi-file-arrow-down"></i></IconButton>
                    <IconButton><i className="bi bi-eye"></i></IconButton>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.contentSection}>
              <h3 style={styles.sectionTitle}>Source References</h3>
              {activeCard.details.sourceReferences.map((ref, index) => (
                <div key={index} style={styles.infoRow}>
                  <span style={styles.value}>{ref}</span>
                  <IconButton><i className="bi bi-eye"></i></IconButton>
                </div>
              ))}
            </div>

            <div style={styles.contentSection}>
              <h3 style={styles.sectionTitle}>Hardness</h3>
              <div style={styles.infoRow}>
                <span style={styles.value}>{activeCard.details.hardness}</span>
                <button style={styles.button}>ℹ</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.placeholder}>Select a card to see details</div>
        )}
      </div>
    </div>
    </Layout>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    height: "100vh",
  },
  leftSection: {
    flex: 3,
    borderRight: "2px solid #ccc",
    overflowY: "scroll",
    padding: "10px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  header: {
    backgroundColor: "#5a5a5a",
    color: "#fff",
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  body: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  date: {
    fontWeight: "bold",
  },
  description: {
    fontStyle: "italic",
  },
  status: {
    fontSize: "14px",
    color: "#333",
  },
  drawer: {
    backgroundColor: "#e6e6e6",
    padding: "10px",
    borderTop: "1px solid #ccc",
  },
  drawerContent: {
    display: "flex",
    justifyContent: "space-between",
  },
  owner: {
    fontStyle: "italic",
    color: "#888",
  },
  rightSection: {
    flex: 1.5,

  
    backgroundColor: "#F0F0F0",
    overflowY: "auto",
  },
  sectionHeader: {
    color: "#d83b6e",
    fontWeight: "bold",

    backgroundColor:'#5A5A5A',
    padding: "10px",
    fontSize: "16px",
   
  },
  subHeader: {
    marginTop: "15px",
    marginBottom: "5px",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    backgroundColor:'red'
  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
  
    marginBottom: "5px",
  },

  contentSection: {
    backgroundColor: "#e6e6e6",
    padding: "8px 16px",
    borderBottom: "1px solid #d4d4d4",
  },
  sectionTitle: {
    color: "#333",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px",
    backgroundColor:'#DDDDDD',
    padding:'8px'
  },
  
  label: {
    flex: 1,
    color: "#666",
    fontSize: "14px",
  },
  value: {
    flex: 1,
    color: "#666",
    fontSize: "14px",
  },
  placeholder: {
    padding: "16px",
    color: "#666",
  }
};

export default ChangeRequest;
