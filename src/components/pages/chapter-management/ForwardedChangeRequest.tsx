import React, { useState } from "react";
import Layout from "../Layout/Layout";
import DrawerContainer from "../../utils/DrawerContainer";
import { Drawer } from "@mui/material";
import styled from "styled-components";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Type definition for Location
interface Location {
  chapter: string;
  level: string;
  residentialArea: string;
  area: string;
  subject: string;
  subtopic: string;
}

// Type definition for a Request
interface Request {
  id: number;
  title: string;
  date: string;
  description: string;
  status: string;
  owner: string;
  customRequirement: string;
  currentRequirement: string;
  location: Location;
  attachments: { name: string; url: string }[];
  sourceReferences: { name: string }[];
}

// Dummy data
const forwardedRequests: Request[] = [
  {
    id: 1,
    title: "01. Planning process pending",
    date: "December 19, 2024",
    description: "The developer will work out the development plan...",
    status: "Forwarded to publisher",
    owner: "Saanvi Owner",
    customRequirement: "d5d5",
    currentRequirement: "Own change",
    location: {
      chapter: "Planning process pending",
      level: "Execution level",
      residentialArea: "All cores",
      area: "fwf",
      subject: "Connection boxes",
      subtopic: "Additions",
    },
    attachments: [
      {
        name: "04.06 Long-term parking A4 Standing.pdf",
        url: "#",
      },
    ],
    sourceReferences: [
      {
        name: "Requirements Package for Child-Safe Fences in Public Spaces",
      },
    ],
  },
  {
    id: 2,
    title: "15. Earthwork and soil quality",
    date: "December 19, 2024",
    description: "Dummy description for earthwork and soil quality.",
    status: "In Progress",
    owner: "John Doe",
    customRequirement: "s",
    currentRequirement: "Soil modification",
    location: {
      chapter: "Earthwork and soil quality",
      level: "Preparation phase",
      residentialArea: "Zone A",
      area: "FWF",
      subject: "Soil testing",
      subtopic: "Quality control",
    },
    attachments: [],
    sourceReferences: [],
  },
];

const ForwardedChangeRequests: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const handleClick = (request: Request) => {
    setSelectedRequest(request);
  };

  return (
    <Layout>
      <div style={{ display: "flex", height: "100%" }}>
        {/* Left panel */}
        <div style={{ flex: "2", padding: "20px", backgroundColor: "#fff" }}>
          <div style={{ 
            backgroundColor: "#666",
            padding: "10px 15px",
            marginBottom: "20px"
          }}>
            <h2 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>
              FORWARDED CHANGE REQUESTS
            </h2>
          </div>

          {forwardedRequests.map((request) => (
            <div
              key={request.id}
              onClick={() => handleClick(request)}
              style={{
                marginBottom: "15px",
                cursor: "pointer",
              }}
            >
              <div style={{
                backgroundColor: "#666",
                padding: "8px 12px",
                marginBottom: "8px"
              }}>
                <h3 style={{ 
                  color: "#fff", 
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "normal"
                }}>
                  {request.title}
                </h3>
              </div>
              <div style={{ padding: "0 12px" }}>
                <div style={{ 
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "4px"
                }}>
                  <span style={{ fontSize: "13px", color: "#666" }}>
                    {request.date}
                  </span>
                  <span style={{ 
                    marginLeft: "10px",
                    fontSize: "13px",
                    color: "#666"
                  }}>
                    {request.customRequirement}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    👤
                  </div>
                  <span style={{ fontSize: "13px", color: "#666" }}>
                    {request.owner}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div style={{ 
          flex: "1",
          backgroundColor: "#F0F0F0",
          padding: "20px",
          borderLeft: "1px solid #ddd"
        }}>
          {selectedRequest ? (
            <>
              {/* Status Button */}
              <StatusButton>
                <i className="fa fa-share" style={{ marginRight: '8px', fontSize: '18px' }}></i>
                {selectedRequest.status}
              </StatusButton>

              {/* Sections */}
              <Section title="Custom requirement">
                <p>{selectedRequest.customRequirement}</p>
              </Section>

              <Section title="Current requirement">
                <p>{selectedRequest.currentRequirement}</p>
              </Section>

              <Section title="Location">
                {Object.entries(selectedRequest.location).map(([key, value]) => (
                  <div key={key} style={locationRowStyle}>
                    <span style={locationLabelStyle}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span style={locationValueStyle}>{value}</span>
                  </div>
                ))}
              </Section>

              <Section title="Attachments">
                {selectedRequest.attachments.map((attachment, index) => (
                  <div key={index} style={attachmentRowStyle}>
                    <span>{attachment.name}</span>
                    <div>
                      <IconButton><i className="bi bi-file-arrow-down"></i></IconButton>
                      <IconButton><i className="bi bi-eye"></i></IconButton>
                    </div>
                  </div>
                ))}
              </Section>

              <Section title="Source references">
                {selectedRequest.sourceReferences.map((ref, index) => (
                  <div key={index} style={attachmentRowStyle}>
                    <span>{ref.name}</span>
                    <IconButton><i className="bi bi-eye"></i></IconButton>
                  </div>
                ))}
              </Section>

              {/* New Hardness section */}
              <Section title="Hardness">
                <div style={hardnessStyle}>
                  {/* Add your hardness content here */}
                  <p>Hardness information goes here</p>
                </div>
              </Section>
            </>
          ) : (
            <p style={{ color: "#666" }}>Select a request to view details</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Reusable Section component
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: "20px" }}>
    <div style={{
      backgroundColor: "#DDDDDD",
      padding: "8px 12px",
      marginBottom: "10px"
    }}>
      <h3 style={{ 
        margin: 0,
        fontSize: "14px",
        fontWeight: "normal",
        color: "#666"
      }}>
        {title}
      </h3>
    </div>
    <div style={{ padding: "0 12px" }}>
      {children}
    </div>
  </div>
);

// Reusable styles
const locationRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #eee"
};

const locationLabelStyle = {
  color: "#666",
  fontSize: "13px"
};

const locationValueStyle = {
  color: "#333",
  fontSize: "13px"
};

const attachmentRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #eee"
};

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

// New styled components
const StatusButton = styled.button`
  background-color: rgb(200, 70, 100);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 20px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.2s ease;

  i {
    font-size: 18px;
    transition: transform 0.2s ease;
  }

  &:hover {
    background-color: #4a4a4a;
    i {
      transform: translateX(2px);
    }
  }

  &:active {
    transform: scale(0.99);
  }
`;

const hardnessStyle = {
  padding: "8px 0",
  borderBottom: "1px solid #eee"
};

export default ForwardedChangeRequests;
