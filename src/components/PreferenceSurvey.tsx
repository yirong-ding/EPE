import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ChevronRight, Leaf } from "lucide-react";
import { UserPreferences } from "../utils/userDataManager";

interface PreferenceSurveyProps {
  onComplete: (preferences: UserPreferences) => void;
}

const interestOptions = [
  { id: "recycling", label: "Waste Sorting & Recycling" },
  { id: "energy", label: "Energy Conservation & Emission Reduction" },
  { id: "water", label: "Water Resource Protection" },
  { id: "biodiversity", label: "Biodiversity" },
  { id: "sustainable", label: "Sustainable Lifestyle" },
  { id: "climate", label: "Climate Change" }
];

const experienceOptions = [
  { value: "beginner", label: "Beginner - Just starting to learn about environmental protection" },
  { value: "intermediate", label: "Intermediate - Have some environmental knowledge" },
  { value: "advanced", label: "Expert - Very knowledgeable about environmental protection" }
];

const goalOptions = [
  { value: "learn", label: "Learn environmental knowledge" },
  { value: "practice", label: "Find practical methods" },
  { value: "share", label: "Share experiences with others" },
  { value: "challenge", label: "Challenge my knowledge" }
];

const gradeOptions = [
  { value: "elementary", label: "Elementary School (Grades 1-5)" },
  { value: "middle", label: "Middle School (Grades 6-8)" },
  { value: "high", label: "High School (Grades 9-12)" },
  { value: "other", label: "Other" }
];

export function PreferenceSurvey({ onComplete }: PreferenceSurveyProps) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete({
        interests: selectedInterests,
        experience,
        goal,
        grade,
        name,
        age: age ? parseInt(age) : undefined
      });
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedInterests.length > 0;
    if (step === 2) return experience !== "";
    if (step === 3) return goal !== "";
    if (step === 4) return grade !== "";
    if (step === 5) return name !== "" && age !== "";
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Tell Us About Your Environmental Interests</CardTitle>
          <CardDescription>
            Answer a few simple questions to help us provide you with a personalized learning experience<br/>
            <span className="text-xs mt-1 inline-block">💡 Your preferences will be used to provide personalized environmental advice and learning content</span>
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-colors ${
                  s <= step ? 'bg-green-600' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-4">Which environmental topics are you interested in? (Select all that apply)</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {interestOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedInterests.includes(option.id)
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : 'border-border hover:border-green-300'
                      }`}
                      onClick={() => handleInterestToggle(option.id)}
                    >
                      <Checkbox
                        id={option.id}
                        checked={selectedInterests.includes(option.id)}
                        onCheckedChange={() => handleInterestToggle(option.id)}
                      />
                      <Label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-4">What is your level of environmental knowledge?</h3>
                <RadioGroup value={experience} onValueChange={setExperience}>
                  <div className="space-y-3">
                    {experienceOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          experience === option.value
                            ? 'border-green-500 bg-green-50 dark:bg-green-950'
                            : 'border-border hover:border-green-300'
                        }`}
                        onClick={() => setExperience(option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label
                          htmlFor={option.value}
                          className="flex-1 cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-4">What is your main goal for using this platform?</h3>
                <RadioGroup value={goal} onValueChange={setGoal}>
                  <div className="space-y-3">
                    {goalOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          goal === option.value
                            ? 'border-green-500 bg-green-50 dark:bg-green-950'
                            : 'border-border hover:border-green-300'
                        }`}
                        onClick={() => setGoal(option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label
                          htmlFor={option.value}
                          className="flex-1 cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-4">What is your educational level?</h3>
                <RadioGroup value={grade} onValueChange={setGrade}>
                  <div className="space-y-3">
                    {gradeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          grade === option.value
                            ? 'border-green-500 bg-green-50 dark:bg-green-950'
                            : 'border-border hover:border-green-300'
                        }`}
                        onClick={() => setGrade(option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label
                          htmlFor={option.value}
                          className="flex-1 cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-4">Tell us a bit about yourself (Optional)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This information helps us personalize your learning experience.
                </p>
              </div>
              <div>
                <Label htmlFor="name" className="mb-2 block">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="age" className="mb-2 block">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="w-full"
                  min="1"
                  max="120"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="ml-auto bg-green-600 hover:bg-green-700"
            >
              {step === 5 ? 'Start Learning' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}