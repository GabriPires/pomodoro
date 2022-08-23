import { createContext, useReducer, useState } from 'react';
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
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  });

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

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
