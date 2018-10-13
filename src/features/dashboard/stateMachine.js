export const  stateMachine = {
    initial: 'withoutMetamask',
    on: {
      LOADING: 'withoutMetamask.loading'
    },
    states: {
      withoutMetamask: {
        onEntry: 'checkForMetaMask',
        on: {
          NO_WEB3: '.noWeb3',
          WITH_METAMASK: 'withMetamask',
        },
        states: {
          noWeb3: {
            onEntry: 'loadDataFromUrlIdentifier',
            on: {
              ERROR_FETCHING_GEMS: 'error',
              GOT_USER_GEMS: 'ideal'
            }
          },
          loading: {
            onEntry: 'loadDataFromUrlIdentifier',
            on: {
              ERROR_FETCHING_GEMS: 'error',
              GOT_USER_GEMS: 'ideal'
            }
          },
          ideal: {
            onEntry: 'populateDashboard'
          },
          error: {
            onEntry: 'showError',
            on: {
              RETURN_TO_MARKET: 'market',
            }
          },
          market: {
            onEntry: 'redirectToMarket',
          }
        }
      },
      withMetamask: {
        initial: 'loading',
        on: {
          LOADING: 'withMetamask.loading'
        },
        states: {
          loading: {
            onEntry: 'loadDataFromUrlIdentifier',
            on: {
              ERROR_FETCHING_GEMS: 'error',
              GOT_USER_GEMS: 'ideal'
            }
          },
          ideal: {
            onEntry: 'populateDashboard'
          },
          error: {
            onEntry: 'showError',
            on: {
              RETURN_TO_MARKET: 'market',
            }
          },
          market: {
            onEntry: 'redirectToMarket',
          }
        }
      }
    }
  };