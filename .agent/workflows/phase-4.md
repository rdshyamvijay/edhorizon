# Phase 4: LMS Hierarchy & Schema (Curriculum Engine)

## 1. Overview
Phase 4 established the backbone of the EdHorizon learning platform. The goal was to design a flexible and hierarchical database schema capable of organizing curriculum content for various subjects and levels, while supporting diverse media formats.

## 2. Development Done
- **Table Structure**: Implemented a 4-tier hierarchy: **Modules** → **Courses** → **Topics** → **Capsules**.
- **Dynamic Content Types**: Defined an enum for `capsule_type` (Video, Quiz, Flashcards).
- **Drafting Workflow**: Implemented a `content_status` lifecycle (Draft, Pending, Published).
- **Automatic Sequencing**: Added `order` columns to all hierarchy levels to support custom sorting.

## 3. Technical Details
### Database Schema
- **Modules**: The top-level root (e.g., "MathHorizon"). Each module has a unique `slug` for clean URL structures.
- **Courses**: Represent grades or difficulty levels (e.g., "Grade 1").
- **Topics**: Represent specific chapters or learning segments.
- **Capsules**: The granular learning units. 
  - **JSONB Content**: Uses a `jsonb` column to store heterogeneous data structure (e.g., Video URLs for video units, Question/Option arrays for quizzes).

### Security (RLS)
- **Consumption Isolation**: Students and Parents can only see `published` capsules.
- **Author Isolation**: Teachers can only edit and view their own `draft` or `pending` capsules.
- **Role-based Select**: All authenticated users can browse the `modules`, `courses`, and `topics` structure.

## 4. Implementation Specs
### Hierarchy Navigation Logic
1. A Course is linked to a Module via `module_id`.
2. A Topic is linked to a Course via `course_id`.
3. A Capsule is linked to a Topic via `topic_id`.
4. Deleting a parent automatically cascades to all children using `ON DELETE CASCADE`.

### Content Lifecycle
- **Draft**: Only visible to the author.
- **Pending**: Visible to the author and admins for review.
- **Published**: Visible to all students enrolled in the module.

## 5. Impact
- **Flexibility**: The JSONB storage allows for adding new capsule types (e.g., Interactive Games) without database migrations.
- **Organization**: Provides a structured environment for teachers to build comprehensive curricula.
- **Integrity**: Cascading deletes ensure that the database remains clean even when large curriculum sections are removed.
