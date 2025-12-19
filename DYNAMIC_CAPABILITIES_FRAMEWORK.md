# Dynamic Capabilities Framework
## Sense, Seize, Transform - Building Organizational Agility

---

## 📋 Table of Contents

1. [Introduction to Dynamic Capabilities](#introduction-to-dynamic-capabilities)
2. [The Three Pillars: Sense, Seize, Transform](#the-three-pillars-sense-seize-transform)
3. [The 70-20-10 Learning Model](#the-70-20-10-learning-model)
4. [Capability Building Methodology](#capability-building-methodology)
5. [Job Architecture Integration](#job-architecture-integration)
6. [Implementation in Golden Canon](#implementation-in-golden-canon)
7. [Measuring Capability Maturity](#measuring-capability-maturity)

---

## Introduction to Dynamic Capabilities

### What are Dynamic Capabilities?

**Definition**: Dynamic capabilities are an organization's ability to integrate, build, and reconfigure internal and external competencies to address rapidly changing environments.

> "Dynamic capabilities are the firm's ability to integrate, build, and reconfigure internal and external competencies to address rapidly changing environments." - David J. Teece

### Why Dynamic Capabilities Matter

**Traditional View**: Competitive advantage comes from resources you own

**Dynamic Capabilities View**: Competitive advantage comes from your ability to:
- **Sense** opportunities and threats
- **Seize** opportunities through resource mobilization
- **Transform** continuously to maintain relevance

**Key Statistics**:
- Companies with strong dynamic capabilities are **3x more likely** to outperform competitors (McKinsey)
- **70% of digital transformations fail** due to lack of organizational capability (BCG)
- Organizations that invest in capability building see **2.5x higher** employee productivity (Deloitte)

### The Resource-Based View (RBV)

**Foundation**: Competitive advantage stems from valuable, rare, inimitable, and non-substitutable (VRIN) resources

**Evolution to Dynamic Capabilities**:

```
Static Resources (RBV)
    ↓
Dynamic Capabilities (Teece)
    ↓
Continuous Reconfiguration
    ↓
Sustained Competitive Advantage
```

**In Golden Canon Context**:
- **Resource**: Organizational knowledge (stored in Law Tables)
- **Capability**: Ability to convert tacit knowledge to executable code
- **Dynamic Capability**: Continuous refinement of RLS/FLS rules based on learning

---

## The Three Pillars: Sense, Seize, Transform

### Overview

```
┌─────────────────────────────────────────────────────────┐
│              DYNAMIC CAPABILITIES CYCLE                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────┐        ┌──────────┐        ┌──────────┐  │
│  │          │        │          │        │          │  │
│  │  SENSE   │───────▶│  SEIZE   │───────▶│TRANSFORM │  │
│  │          │        │          │        │          │  │
│  └──────────┘        └──────────┘        └──────────┘  │
│       │                                         │        │
│       │                                         │        │
│       └─────────────────────────────────────────┘        │
│                    Feedback Loop                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 1. SENSE: Identifying Opportunities and Threats

**Definition**: Scanning, searching, and exploring across technologies and markets

**Key Activities**:
- Environmental scanning
- User feedback collection
- Market trend analysis
- Competitive intelligence
- Internal capability assessment

**In Golden Canon**:

```javascript
// src/lib/SensingEngine.js
export class SensingEngine {
  async scanEnvironment() {
    // Collect signals from multiple sources
    const signals = await Promise.all([
      this.scanUserRequests(),
      this.scanAccessDenials(),
      this.scanCapabilityGaps(),
      this.scanExternalTrends()
    ]);

    return this.analyzeSignals(signals);
  }

  async scanUserRequests() {
    // Analyze patterns in user requests
    const requests = await base44
      .from('knowledge_capture')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    // Identify emerging needs
    const patterns = this.identifyPatterns(requests);
    return {
      type: 'user_requests',
      patterns,
      priority: this.calculatePriority(patterns)
    };
  }

  async scanAccessDenials() {
    // Analyze denied access attempts
    const denials = await base44
      .from('audit_logs')
      .select('*')
      .eq('granted', false)
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    // Identify capability gaps
    const gaps = this.identifyCapabilityGaps(denials);
    return {
      type: 'capability_gaps',
      gaps,
      urgency: this.calculateUrgency(gaps)
    };
  }

  async scanCapabilityGaps() {
    // Compare required vs. actual capabilities
    const gaps = await base44.rpc('identify_capability_gaps');
    return {
      type: 'skill_gaps',
      gaps,
      impact: this.calculateBusinessImpact(gaps)
    };
  }

  identifyPatterns(data) {
    // Use clustering or pattern recognition
    const grouped = data.reduce((acc, item) => {
      const key = item.category || 'uncategorized';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  calculatePriority(patterns) {
    // High frequency + high business impact = high priority
    return patterns.map(p => ({
      ...p,
      priority: p.count * this.getBusinessImpact(p.category)
    }));
  }
}
```

**Sensing Metrics**:

```sql
-- Opportunity Detection Rate
CREATE OR REPLACE FUNCTION calculate_opportunity_detection_rate()
RETURNS TABLE (
  opportunity_type TEXT,
  detected_count INTEGER,
  acted_upon_count INTEGER,
  detection_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.type as opportunity_type,
    COUNT(*) as detected_count,
    SUM(CASE WHEN o.status = 'acted_upon' THEN 1 ELSE 0 END)::INTEGER as acted_upon_count,
    (SUM(CASE WHEN o.status = 'acted_upon' THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100 as detection_rate
  FROM opportunities o
  WHERE o.detected_at > NOW() - INTERVAL '90 days'
  GROUP BY o.type;
END;
$$ LANGUAGE plpgsql;
```

### 2. SEIZE: Mobilizing Resources to Capture Value

**Definition**: Addressing opportunities through new products, processes, or services

**Key Activities**:
- Resource allocation
- Capability development
- Process design
- Partnership formation
- Investment decisions

**In Golden Canon**:

```typescript
// functions/seizingEngine.ts
import { base44 } from '@base44/sdk';

export class SeizingEngine {
  async seizeOpportunity(opportunity: {
    type: string;
    description: string;
    requiredCapabilities: string[];
    estimatedImpact: number;
  }) {
    // Step 1: Assess current capability
    const currentCapability = await this.assessCapability(
      opportunity.requiredCapabilities
    );

    // Step 2: Identify capability gap
    const gap = this.calculateGap(
      opportunity.requiredCapabilities,
      currentCapability
    );

    // Step 3: Design learning path
    const learningPath = await this.designLearningPath(gap);

    // Step 4: Allocate resources
    const resources = await this.allocateResources(learningPath);

    // Step 5: Execute capability building
    const execution = await this.executeCapabilityBuilding(
      learningPath,
      resources
    );

    return {
      opportunity,
      gap,
      learningPath,
      resources,
      execution
    };
  }

  async assessCapability(requiredCapabilities: string[]) {
    const assessments = await Promise.all(
      requiredCapabilities.map(async (capName) => {
        const users = await base44
          .from('user_capabilities')
          .select(`
            *,
            capabilities!inner(name)
          `)
          .eq('capabilities.name', capName);

        const avgScore = users.reduce((sum, u) => 
          sum + u.experience_score + u.social_score + u.formal_score, 0
        ) / users.length;

        return {
          capability: capName,
          currentLevel: avgScore,
          userCount: users.length
        };
      })
    );

    return assessments;
  }

  calculateGap(required: string[], current: any[]) {
    return required.map(req => {
      const curr = current.find(c => c.capability === req);
      return {
        capability: req,
        currentLevel: curr?.currentLevel || 0,
        requiredLevel: 100, // Full capability
        gap: 100 - (curr?.currentLevel || 0),
        priority: this.calculatePriority(req)
      };
    });
  }

  async designLearningPath(gaps: any[]) {
    // Apply 70-20-10 model
    return gaps.map(gap => ({
      capability: gap.capability,
      experiential: this.designExperientialLearning(gap), // 70%
      social: this.designSocialLearning(gap),             // 20%
      formal: this.designFormalLearning(gap),             // 10%
      estimatedDuration: this.estimateDuration(gap)
    }));
  }

  designExperientialLearning(gap: any) {
    // 70% - On-the-job learning
    return {
      type: 'experiential',
      activities: [
        {
          name: 'Shadowing',
          duration: '2 weeks',
          points: 20
        },
        {
          name: 'Assisted Tasks',
          duration: '4 weeks',
          points: 30
        },
        {
          name: 'Independent Tasks',
          duration: '6 weeks',
          points: 20
        }
      ],
      totalPoints: 70
    };
  }

  designSocialLearning(gap: any) {
    // 20% - Mentoring and coaching
    return {
      type: 'social',
      activities: [
        {
          name: 'Weekly Mentoring Sessions',
          duration: '12 weeks',
          points: 15
        },
        {
          name: 'Peer Review',
          duration: 'Ongoing',
          points: 5
        }
      ],
      totalPoints: 20
    };
  }

  designFormalLearning(gap: any) {
    // 10% - Courses and training
    return {
      type: 'formal',
      activities: [
        {
          name: 'Online Course',
          duration: '2 weeks',
          points: 5
        },
        {
          name: 'Certification',
          duration: '1 week',
          points: 5
        }
      ],
      totalPoints: 10
    };
  }

  async allocateResources(learningPath: any[]) {
    // Identify mentors, courses, and time allocation
    return {
      mentors: await this.findMentors(learningPath),
      courses: await this.findCourses(learningPath),
      timeAllocation: this.calculateTimeAllocation(learningPath),
      budget: this.calculateBudget(learningPath)
    };
  }

  async executeCapabilityBuilding(learningPath: any[], resources: any) {
    // Create learning assignments
    const assignments = await Promise.all(
      learningPath.map(async (path) => {
        return base44.from('learning_assignments').insert({
          capability: path.capability,
          experiential_activities: path.experiential.activities,
          social_activities: path.social.activities,
          formal_activities: path.formal.activities,
          assigned_mentor: resources.mentors[path.capability],
          assigned_courses: resources.courses[path.capability],
          start_date: new Date(),
          estimated_completion: path.estimatedDuration
        });
      })
    );

    return assignments;
  }
}
```

**Seizing Metrics**:

```sql
-- Opportunity Capture Rate
CREATE OR REPLACE FUNCTION calculate_opportunity_capture_rate()
RETURNS NUMERIC AS $$
DECLARE
  v_captured INTEGER;
  v_identified INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_identified FROM opportunities;
  SELECT COUNT(*) INTO v_captured FROM opportunities WHERE status = 'captured';
  
  RETURN (v_captured::NUMERIC / v_identified::NUMERIC) * 100;
END;
$$ LANGUAGE plpgsql;

-- Time to Capability
CREATE OR REPLACE FUNCTION calculate_time_to_capability()
RETURNS TABLE (
  capability_name TEXT,
  avg_days NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.name,
    AVG(EXTRACT(EPOCH FROM (la.completed_at - la.start_date)) / 86400) as avg_days
  FROM learning_assignments la
  JOIN capabilities c ON la.capability = c.name
  WHERE la.status = 'completed'
  GROUP BY c.name;
END;
$$ LANGUAGE plpgsql;
```

### 3. TRANSFORM: Continuous Renewal and Reconfiguration

**Definition**: Continuous renewal to maintain alignment with changing environment

**Key Activities**:
- Process optimization
- Capability reconfiguration
- Knowledge base updates
- RLS/FLS policy refinement
- Organizational learning

**In Golden Canon**:

```typescript
// functions/transformationEngine.ts
import { base44 } from '@base44/sdk';

export class TransformationEngine {
  async continuousTransformation() {
    // Monitor performance
    const performance = await this.monitorPerformance();

    // Identify transformation needs
    const needs = await this.identifyTransformationNeeds(performance);

    // Execute transformations
    const transformations = await Promise.all(
      needs.map(need => this.executeTransformation(need))
    );

    return transformations;
  }

  async monitorPerformance() {
    const [
      capabilityUsage,
      accessPatterns,
      learningProgress,
      businessOutcomes
    ] = await Promise.all([
      base44.rpc('analyze_capability_usage'),
      base44.rpc('analyze_access_patterns'),
      base44.rpc('analyze_learning_progress'),
      base44.rpc('analyze_business_outcomes')
    ]);

    return {
      capabilityUsage,
      accessPatterns,
      learningProgress,
      businessOutcomes
    };
  }

  async identifyTransformationNeeds(performance: any) {
    const needs = [];

    // Check for underutilized capabilities
    if (performance.capabilityUsage.some(c => c.usage < 0.3)) {
      needs.push({
        type: 'capability_retirement',
        reason: 'Low utilization',
        action: 'Archive or remove capability'
      });
    }

    // Check for capability gaps
    if (performance.accessPatterns.denialRate > 0.2) {
      needs.push({
        type: 'capability_creation',
        reason: 'High denial rate',
        action: 'Create new capability'
      });
    }

    // Check for learning bottlenecks
    if (performance.learningProgress.avgTimeToCapability > 90) {
      needs.push({
        type: 'learning_optimization',
        reason: 'Slow capability development',
        action: 'Optimize learning paths'
      });
    }

    // Check for misaligned outcomes
    if (performance.businessOutcomes.alignmentScore < 0.8) {
      needs.push({
        type: 'capability_realignment',
        reason: 'Poor business outcome alignment',
        action: 'Reconfigure capabilities'
      });
    }

    return needs;
  }

  async executeTransformation(need: any) {
    switch (need.type) {
      case 'capability_retirement':
        return this.retireCapability(need);
      
      case 'capability_creation':
        return this.createCapability(need);
      
      case 'learning_optimization':
        return this.optimizeLearning(need);
      
      case 'capability_realignment':
        return this.realignCapability(need);
      
      default:
        throw new Error(`Unknown transformation type: ${need.type}`);
    }
  }

  async retireCapability(need: any) {
    // Archive low-usage capability
    const capability = await base44
      .from('capabilities')
      .update({ status: 'archived', archived_at: new Date() })
      .eq('usage_rate', '<', 0.3)
      .select();

    // Remove RLS policies
    await base44.rpc('remove_rls_policies', {
      capability_ids: capability.map(c => c.id)
    });

    return {
      action: 'retired',
      capabilities: capability
    };
  }

  async createCapability(need: any) {
    // Analyze denied access patterns
    const denials = await base44
      .from('audit_logs')
      .select('*')
      .eq('granted', false)
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    // Identify common patterns
    const patterns = this.clusterDenials(denials);

    // Create new capabilities
    const newCapabilities = await Promise.all(
      patterns.map(pattern => 
        base44.from('capabilities').insert({
          name: pattern.suggestedName,
          description: pattern.description,
          required_experience_score: 70,
          required_social_score: 20,
          required_formal_score: 10
        })
      )
    );

    return {
      action: 'created',
      capabilities: newCapabilities
    };
  }

  async optimizeLearning(need: any) {
    // Analyze learning bottlenecks
    const bottlenecks = await base44.rpc('identify_learning_bottlenecks');

    // Adjust learning paths
    const optimizations = await Promise.all(
      bottlenecks.map(async (bottleneck) => {
        // Reduce formal learning, increase experiential
        return base44
          .from('capabilities')
          .update({
            required_experience_score: bottleneck.required_experience_score + 10,
            required_formal_score: Math.max(0, bottleneck.required_formal_score - 10)
          })
          .eq('id', bottleneck.capability_id);
      })
    );

    return {
      action: 'optimized',
      optimizations
    };
  }

  async realignCapability(need: any) {
    // Analyze business outcome alignment
    const misaligned = await base44.rpc('identify_misaligned_capabilities');

    // Reconfigure capabilities
    const realignments = await Promise.all(
      misaligned.map(async (cap) => {
        // Update capability definition based on actual business needs
        return base44
          .from('capabilities')
          .update({
            description: cap.suggestedDescription,
            constraints: cap.suggestedConstraints,
            context: cap.suggestedContext
          })
          .eq('id', cap.id);
      })
    );

    // Regenerate RLS policies
    await Promise.all(
      misaligned.map(cap => 
        base44.rpc('regenerate_rls_policy', { capability_id: cap.id })
      )
    );

    return {
      action: 'realigned',
      realignments
    };
  }
}
```

**Transformation Metrics**:

```sql
-- Transformation Velocity
CREATE OR REPLACE FUNCTION calculate_transformation_velocity()
RETURNS NUMERIC AS $$
DECLARE
  v_transformations INTEGER;
  v_days INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_transformations 
  FROM transformation_events 
  WHERE executed_at > NOW() - INTERVAL '90 days';
  
  v_days := 90;
  
  RETURN v_transformations::NUMERIC / v_days::NUMERIC;
END;
$$ LANGUAGE plpgsql;

-- Adaptation Success Rate
CREATE OR REPLACE FUNCTION calculate_adaptation_success_rate()
RETURNS NUMERIC AS $$
DECLARE
  v_successful INTEGER;
  v_total INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total FROM transformation_events;
  SELECT COUNT(*) INTO v_successful 
  FROM transformation_events 
  WHERE outcome = 'successful';
  
  RETURN (v_successful::NUMERIC / v_total::NUMERIC) * 100;
END;
$$ LANGUAGE plpgsql;
```

---

## The 70-20-10 Learning Model

### Overview

The **70-20-10 model** states that effective learning comes from:
- **70%** Experiential (challenging assignments, on-the-job learning)
- **20%** Social (coaching, mentoring, feedback)
- **10%** Formal (courses, training programs)

### Why 70-20-10?

**Research Findings**:
- **70% of learning** happens through experience and practice (Center for Creative Leadership)
- **20% of learning** comes from interactions with others (mentors, peers)
- **10% of learning** comes from formal educational events

**Traditional Approach** (Inverted):
```
90% Formal Training → 10% Application → Low Retention
```

**70-20-10 Approach**:
```
70% Doing → 20% Coaching → 10% Training → High Retention
```

### Implementation in Golden Canon

#### Database Schema

```sql
-- Learning Events Tracking
CREATE TABLE learning_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  capability_id UUID REFERENCES capabilities(id),
  type TEXT CHECK (type IN ('experiential', 'social', 'formal')),
  activity TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  weight NUMERIC CHECK (weight IN (0.7, 0.2, 0.1)),
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Learning Assignments
CREATE TABLE learning_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  capability_id UUID REFERENCES capabilities(id),
  experiential_activities JSONB,
  social_activities JSONB,
  formal_activities JSONB,
  start_date TIMESTAMP DEFAULT NOW(),
  estimated_completion TIMESTAMP,
  actual_completion TIMESTAMP,
  status TEXT DEFAULT 'in_progress'
);

-- Capability Score Calculation
CREATE OR REPLACE FUNCTION calculate_capability_score(
  p_user_id UUID,
  p_capability_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_experiential INTEGER;
  v_social INTEGER;
  v_formal INTEGER;
  v_total INTEGER;
BEGIN
  -- Sum points by type
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'experiential' THEN points_earned ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN type = 'social' THEN points_earned ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN type = 'formal' THEN points_earned ELSE 0 END), 0)
  INTO v_experiential, v_social, v_formal
  FROM learning_events
  WHERE user_id = p_user_id
    AND capability_id = p_capability_id;
  
  -- Calculate weighted total
  v_total := (v_experiential * 0.7) + (v_social * 0.2) + (v_formal * 0.1);
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql;
```

#### Tracking Experiential Learning (70%)

```typescript
// functions/trackExperiential.ts
import { base44 } from '@base44/sdk';

export async function trackExperientialLearning(
  userId: string,
  capabilityId: string,
  activity: {
    type: 'shadowing' | 'assisted_task' | 'independent_task' | 'problem_solving';
    description: string;
    complexity: 'low' | 'medium' | 'high';
    outcome: 'success' | 'partial' | 'failure';
  }
) {
  // Calculate points based on complexity and outcome
  const pointsMap = {
    shadowing: { low: 5, medium: 10, high: 15 },
    assisted_task: { low: 10, medium: 15, high: 20 },
    independent_task: { low: 15, medium: 20, high: 25 },
    problem_solving: { low: 20, medium: 25, high: 30 }
  };

  const outcomeMultiplier = {
    success: 1.0,
    partial: 0.7,
    failure: 0.3 // Still learn from failure
  };

  const basePoints = pointsMap[activity.type][activity.complexity];
  const finalPoints = Math.round(basePoints * outcomeMultiplier[activity.outcome]);

  // Record learning event
  await base44.from('learning_events').insert({
    user_id: userId,
    capability_id: capabilityId,
    type: 'experiential',
    activity: `${activity.type}: ${activity.description}`,
    points_earned: finalPoints,
    weight: 0.7,
    metadata: {
      complexity: activity.complexity,
      outcome: activity.outcome
    }
  });

  // Update user capability score
  await updateCapabilityScore(userId, capabilityId);

  return { points: finalPoints, type: 'experiential' };
}
```

#### Tracking Social Learning (20%)

```typescript
// functions/trackSocial.ts
import { base44 } from '@base44/sdk';

export async function trackSocialLearning(
  userId: string,
  capabilityId: string,
  activity: {
    type: 'mentoring' | 'peer_review' | 'coaching' | 'collaboration';
    mentorId?: string;
    duration: number; // minutes
    quality: 'low' | 'medium' | 'high';
  }
) {
  // Calculate points based on duration and quality
  const pointsPerHour = {
    mentoring: 10,
    peer_review: 5,
    coaching: 8,
    collaboration: 6
  };

  const qualityMultiplier = {
    low: 0.5,
    medium: 1.0,
    high: 1.5
  };

  const hours = activity.duration / 60;
  const basePoints = pointsPerHour[activity.type] * hours;
  const finalPoints = Math.round(basePoints * qualityMultiplier[activity.quality]);

  // Record learning event
  await base44.from('learning_events').insert({
    user_id: userId,
    capability_id: capabilityId,
    type: 'social',
    activity: `${activity.type} session`,
    points_earned: finalPoints,
    weight: 0.2,
    metadata: {
      mentor_id: activity.mentorId,
      duration_minutes: activity.duration,
      quality: activity.quality
    }
  });

  // Update user capability score
  await updateCapabilityScore(userId, capabilityId);

  return { points: finalPoints, type: 'social' };
}
```

#### Tracking Formal Learning (10%)

```typescript
// functions/trackFormal.ts
import { base44 } from '@base44/sdk';

export async function trackFormalLearning(
  userId: string,
  capabilityId: string,
  activity: {
    type: 'course' | 'certification' | 'workshop' | 'reading';
    name: string;
    provider: string;
    completionStatus: 'completed' | 'in_progress' | 'failed';
    score?: number; // 0-100
  }
) {
  // Calculate points based on type and completion
  const pointsMap = {
    course: 20,
    certification: 30,
    workshop: 15,
    reading: 5
  };

  const completionMultiplier = {
    completed: 1.0,
    in_progress: 0.5,
    failed: 0.2
  };

  let finalPoints = pointsMap[activity.type] * completionMultiplier[activity.completionStatus];

  // Bonus for high scores
  if (activity.score && activity.score >= 90) {
    finalPoints *= 1.2;
  }

  finalPoints = Math.round(finalPoints);

  // Record learning event
  await base44.from('learning_events').insert({
    user_id: userId,
    capability_id: capabilityId,
    type: 'formal',
    activity: `${activity.type}: ${activity.name}`,
    points_earned: finalPoints,
    weight: 0.1,
    metadata: {
      provider: activity.provider,
      completion_status: activity.completionStatus,
      score: activity.score
    }
  });

  // Update user capability score
  await updateCapabilityScore(userId, capabilityId);

  return { points: finalPoints, type: 'formal' };
}
```

#### Capability Score Update

```typescript
// functions/updateCapabilityScore.ts
import { base44 } from '@base44/sdk';

async function updateCapabilityScore(userId: string, capabilityId: string) {
  // Calculate new score using database function
  const { data: score } = await base44.rpc('calculate_capability_score', {
    p_user_id: userId,
    p_capability_id: capabilityId
  });

  // Update user_capabilities table
  await base44
    .from('user_capabilities')
    .upsert({
      user_id: userId,
      capability_id: capabilityId,
      total_score: score,
      updated_at: new Date()
    });

  // Check if capability threshold met
  const { data: capability } = await base44
    .from('capabilities')
    .select('required_experience_score, required_social_score, required_formal_score')
    .eq('id', capabilityId)
    .single();

  const requiredTotal = 
    capability.required_experience_score +
    capability.required_social_score +
    capability.required_formal_score;

  if (score >= requiredTotal) {
    // Capability achieved!
    await base44.from('capability_achievements').insert({
      user_id: userId,
      capability_id: capabilityId,
      achieved_at: new Date(),
      final_score: score
    });

    // Trigger notification
    await notifyCapabilityAchieved(userId, capabilityId);
  }

  return score;
}
```

---

## Capability Building Methodology

### Step-by-Step Process

#### Step 1: Define Capability

```typescript
interface CapabilityDefinition {
  name: string;
  description: string;
  businessValue: string;
  requiredFor: string[]; // Job roles
  prerequisites: string[]; // Other capabilities
  learningPath: {
    experiential: Activity[];
    social: Activity[];
    formal: Activity[];
  };
  assessmentC
