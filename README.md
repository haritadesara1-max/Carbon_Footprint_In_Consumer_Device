# 🌿 Carbon Trackr – AI-Powered Carbon Footprint & E-Waste Management System

## 📘 Overview
**Carbon Trackr** is an AI-driven web application developed by **Team Syntax Squad** from **Pandit Deendayal Energy University (PDEU), Gujarat**, for **HackX 2025** organised by **Nirma University**.  
The system enables both **individual users** and **MNCs** to monitor, reduce, and report their **carbon footprint** while responsibly managing **e-waste**.  
It integrates **OCR technology**, **AI chatbot assistance**, and **gamification** to make sustainability measurable, engaging, and actionable.

---

## 🧠 Problem Statement
With rapid industrialization, energy use and e-waste generation have increased drastically, leading to severe environmental damage.  
Both individuals and corporations struggle to accurately measure their carbon impact and comply with sustainability norms such as **CSR (Corporate Social Responsibility)** and **ESG (Environmental, Social, and Governance)** reporting.  
Existing solutions are often complex, unengaging, or lack actionable insights.

---

## 💡 Proposed Solution
**Carbon Trackr** bridges this gap through a unified platform that:
1. Calculates carbon emissions from **electricity usage or bill uploads**.
2. Uses an **OCR Engine** to extract energy data automatically from uploaded documents.
3. Includes an **AI Chatbot** for instant support, sustainability tips, and FAQs.
4. Tracks and promotes **e-waste recycling** through verified centers.
5. Engages users through **gamified points, badges, and certificates**.
6. Supports MNCs in fulfilling **CSR and ESG obligations** while earning potential **tax benefits**.

---

## ⚙️ Features
- 🌍 **Carbon Emission Tracking:** Calculates monthly emissions from electricity bills or user input.  
- 📸 **OCR Engine Integration:** Extracts consumption details from scanned bills or images.  
- 🧠 **AI Chatbot:** Guides users, answers sustainability questions, and simplifies navigation.  
- 🗑️ **E-Waste Management:** Enables proper tracking, disposal, and verification of electronic waste.  
- 🏆 **Gamified Rewards System:** Points, levels, and badges for eco-friendly behavior.  
- 🧾 **Certificates & Compliance:** Provides verifiable certificates for MNCs and users on emission reduction or e-waste disposal.  
- 📊 **Analytics Dashboard:** Interactive graphs and visualizations for real-time emission and waste insights.  
- 🔐 **User Authentication:** Secure access through Supabase with role-based login for MNCs and public users.

---

## 🧰 Tech Stack

### **Frontend**
- React  
- TypeScript / JavaScript  
- Tailwind CSS  
- Vite  

### **Backend / Database**
- Supabase  
- PostgreSQL  
- OCR Engine (for document text extraction)  
- AI Chatbot (custom AI assistant for sustainability queries)

### **Analytics**
- Predefined carbon emission factors based on **appliances** and **Indian states**  

### **Gamification**
- Custom logic for **points**, **badges**, and **certification**  

---

## 🧩 Installation
Since Carbon Trackr is not yet deployed, follow these steps to run it locally:

```bash
# 1. Clone the repository
git clone https://github.com/haritadesara1-max/carbon-trackr.git

# 2. Navigate to the project folder
cd carbon-trackr

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev