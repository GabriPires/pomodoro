import { differenceInSeconds } from 'date-fns';
import { createContext, useEffect, useReducer, useState } from 'react';
import {
  addNewCycleAction,
  interruptCurrentCycleAsFinishedAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions';
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer';

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextData {
  cycles: Cycle[];
  activeCycle?: Cycle;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished(): void;
  setSecondsPassed(secondsPassed: number): void;
  createNewCycle(data: CreateCycleData): void;
  interruptCurrentCycle(): void;
}

export const CyclesContext = createContext({} as CyclesContextData);

interface CyclesContextProviderProps {
  children: React.ReactNode;
}

export const CyclesContextProvider = ({
  children,
}: CyclesContextProviderProps) => {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJson = localStorage.getItem(
        '@gabpires-pomodoro:cycles-state-1.0.0',
      );

      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson);
      }
    },
  );

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }

    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);
    localStorage.setItem('@gabpires-pomodoro:cycles-state-1.0.0', stateJSON);
  }, [cyclesState]);

  const setSecondsPassed = (secondsPassed: number) => {
    setAmountSecondsPassed(secondsPassed);
  };

  const markCurrentCycleAsFinished = () => {
    dispatch(markCurrentCycleAsFinishedAction());
  };

  const createNewCycle = (data: CreateCycleData) => {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };
    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
  };

  const interruptCurrentCycle = () => {
    dispatch(interruptCurrentCycleAsFinishedAction());
  };

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
};
