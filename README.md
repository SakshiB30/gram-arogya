# 🩺 ASHA

### Offline-First Rural Healthcare Management System

**ASHA** is a digital healthcare management platform designed to support **rural healthcare workers and beneficiaries**.

It connects **Admin, ANM, and ASHA workers** through a centralized platform for managing beneficiaries, field visits, health records, medicines, notifications, and healthcare activities.

The main focus of ASHA is to enable **ASHA workers to continue essential field activities even when internet connectivity is unavailable**.

---

## 🎯 Problem

Rural healthcare workers often face:

* Poor or unstable internet connectivity
* Paper-based or fragmented health records
* Difficulty accessing beneficiary information during field visits
* Difficulty tracking visits and follow-ups
* Limited coordination between healthcare workers
* Challenges in recording data during field work

---

## 💡 Solution

ASHA provides an **offline-first digital healthcare platform** that allows healthcare workers to manage rural healthcare activities efficiently.

The system provides:

* Centralized beneficiary management
* Field visit management
* Digital health records
* Medicine management
* Notifications and alerts
* Role-based dashboards
* Admin and ANM supervision
* Offline ASHA field operations
* Offline data synchronization

When the network is unavailable, ASHA workers can store field data locally and synchronize it with the central system when connectivity is restored.

![ASHA Workflow](https://private-user-images.githubusercontent.com/252722354/658108782-c06129d3-fc29-4d21-af81-127a890584e7.png)

---

## 👥 User Roles

### Admin

Manages users, healthcare workers, verification, and overall system activities.

### ANM

Supervises ASHA workers and manages beneficiaries, visits, and health information.

### ASHA

Performs field-level healthcare activities, manages assigned beneficiaries, records visits, and collects health information.

---

## ⭐ Key Features

![Key Features](https://private-user-images.githubusercontent.com/252722354/658114220-0d3daf4d-c017-45ff-a67c-8aa20a2eeb19.png)

---

## 📶 Offline-First ASHA Workflow

ASHA workers can continue field activities without continuous internet connectivity.

**ASHA → Assigned Beneficiary → Field Visit → Collect Data → Store Locally → Network Restored → Synchronize → Central System**

The system uses **IndexedDB** to temporarily store beneficiary, visit, and health information that needs to be synchronized later.

---

## 🛠️ Technology

**Frontend:** React, Redux Toolkit, React Router, Axios, Tailwind CSS

**Backend:** Java, Spring Boot, Spring Security, REST APIs, JWT

**Database:** MongoDB

**Offline Storage:** IndexedDB

---

## 🏗️ System Architecture

The system follows a role-based architecture where Admin, ANM, and ASHA users interact with the healthcare platform.

**Users → React Frontend → Spring Boot Backend → MongoDB**

For ASHA offline operations:

**ASHA → React → IndexedDB → Sync Queue → Backend → MongoDB**

![System Architecture](https://private-user-images.githubusercontent.com/252722354/658117021-ca67e535-ba7c-4a72-ba97-7b4eb4a998aa.png)

---

## 🌍 Impact

ASHA aims to:

* Reduce dependency on paper-based healthcare records
* Support healthcare workers in low-connectivity areas
* Improve beneficiary information management
* Simplify field visit tracking
* Improve coordination between healthcare workers
* Support continuous rural healthcare operations

---

## 🔮 Future Scope

* Advanced offline synchronization
* Multilingual support
* Progressive Web App support
* Healthcare analytics and reporting
* Automated health reminders
* Geolocation-based field activities
* Improved ASHA scheduling
* Mobile application support


---

## 🎯 Vision

> **To make rural healthcare management accessible, organized, and reliable — even when the network is unavailable.**

### 🩺 ASHA

**Digital Healthcare. Offline Capable. Rural Focused.**
