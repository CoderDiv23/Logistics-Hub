import React from 'react';

const SkeletonScreen = ({ type = 'dashboard' }) => {
  // Dashboard skeleton
  if (type === 'dashboard') {
    return (
      <div className="container-fluid">
        {/* Header skeleton */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="placeholder-glow">
              <span className="placeholder col-3 bg-secondary"></span>
              <span className="placeholder col-2 bg-secondary ms-3"></span>
            </div>
          </div>
        </div>
        
        {/* Stats cards skeleton */}
        <div className="row mb-4">
          {[1, 2, 3, 4].map(item => (
            <div className="col-md-3 col-sm-6 mb-3" key={item}>
              <div className="card h-100 border-start border-4 border-secondary shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="placeholder col-6 bg-secondary"></span>
                      <span className="placeholder col-4 bg-secondary mt-2"></span>
                    </div>
                    <div className="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                      <span className="placeholder bg-secondary" style={{width: '20px', height: '20px', borderRadius: '50%'}}></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Chart skeleton */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <span className="placeholder col-3 bg-secondary"></span>
              </div>
              <div className="card-body">
                <div className="border rounded p-4" style={{ height: '400px' }}>
                  <div className="d-flex align-items-end h-100">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => (
                      <div key={item} className="me-3 text-center" style={{ width: '60px' }}>
                        <div className="d-flex flex-column justify-content-end h-100">
                          <div className="bg-secondary mx-auto" style={{ width: '40px', height: `${Math.random() * 80 + 20}%` }}></div>
                        </div>
                        <div className="mt-2">
                          <span className="placeholder col-8 bg-secondary"></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Table skeleton */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <span className="placeholder col-2 bg-secondary"></span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        {[1, 2, 3, 4, 5, 6].map(item => (
                          <th key={item}>
                            <span className="placeholder col-8 bg-secondary"></span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map(row => (
                        <tr key={row}>
                          {[1, 2, 3, 4, 5, 6].map(col => (
                            <td key={col}>
                              <span className="placeholder col-6 bg-secondary"></span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Table skeleton
  if (type === 'table') {
    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              {[1, 2, 3, 4, 5].map(item => (
                <th key={item}>
                  <span className="placeholder col-8 bg-secondary"></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(row => (
              <tr key={row}>
                {[1, 2, 3, 4, 5].map(col => (
                  <td key={col}>
                    <span className="placeholder col-6 bg-secondary"></span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  // Card skeleton
  if (type === 'card') {
    return (
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <span className="placeholder col-3 bg-secondary"></span>
        </div>
        <div className="card-body">
          <span className="placeholder col-6 bg-secondary"></span>
          <span className="placeholder col-4 bg-secondary mt-2"></span>
          <span className="placeholder col-8 bg-secondary mt-2"></span>
        </div>
      </div>
    );
  }
  
  // List skeleton
  if (type === 'list') {
    return (
      <div className="list-group">
        {[1, 2, 3, 4, 5].map(item => (
          <div className="list-group-item" key={item}>
            <span className="placeholder col-8 bg-secondary"></span>
            <span className="placeholder col-4 bg-secondary mt-2"></span>
          </div>
        ))}
      </div>
    );
  }
  
  // Default skeleton
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default SkeletonScreen;