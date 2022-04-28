import React from 'react';

import type { CaseReducers } from './createReducer';

export type ActionWithPayload<P extends any[]> = (...payload: P) => void;
export type ActionWithoutPayload = () => void;

export type ActionFromCR<S, CR> = CR extends (state: S) => S
  ? ActionWithoutPayload
  : CR extends (state: S, ...payload: infer P) => S
  ? ActionWithPayload<P>
  : ActionWithoutPayload;

export type DispatchFromCRs<S, CRs extends CaseReducers<S>> = {
  [Type in keyof CRs]: ActionFromCR<S, CRs[Type]>;
};

export type ArgOfCreateDispatch<S, CRs extends CaseReducers<S>> = {
  reactDispatch: React.Dispatch<any>;
  caseReducers: CRs;
};

export default function createDispatch<S, CRs extends CaseReducers<S>>({
  reactDispatch,
  caseReducers,
}: ArgOfCreateDispatch<S, CRs>): DispatchFromCRs<S, CRs> {
  console.log('create a dispatch');
  const reducerNames = Object.keys(caseReducers);
  const dispatch = {} as any;
  reducerNames.forEach(reducerName => {
    dispatch[reducerName] = function (...args: any[]) {
      reactDispatch({ type: reducerName, payload: args });
    };
  });

  return dispatch;
}
