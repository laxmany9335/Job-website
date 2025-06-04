import React from 'react';

function SocialMedia() {
  const socialAccounts = [
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      username: '@laxmanyadav',
      url: 'https://linkedin.com/in/laxmanyadav',
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'GitHub',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      username: '@laxmanyadav',
      url: 'https://github.com/laxmanyadav',
      color: 'text-gray-700 bg-gray-50 hover:bg-gray-100'
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      username: '@laxmandev',
      url: 'https://twitter.com/laxmandev',
      color: 'text-blue-500 bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 7.989.013 6.756.072 5.524.131 4.718.316 4.003.676c-.751.369-1.417.861-2.016 1.46-.599.599-1.091 1.265-1.46 2.016C.316 4.718.131 5.524.072 6.756.013 7.989 0 8.396 0 12.017c0 3.621.013 4.028.072 5.261.059 1.232.244 2.038.604 2.753.369.751.861 1.417 1.46 2.016.599.599 1.265 1.091 2.016 1.46.715.36 1.521.545 2.753.604C7.989 23.987 8.396 24 12.017 24c3.621 0 4.028-.013 5.261-.072 1.232-.059 2.038-.244 2.753-.604.751-.369 1.417-.861 2.016-1.46.599-.599 1.091-1.265 1.46-2.016.36-.715.545-1.521.604-2.753C23.987 16.045 24 15.638 24 12.017c0-3.621-.013-4.028-.072-5.261-.059-1.232-.244-2.038-.604-2.753-.369-.751-.861-1.417-1.46-2.016C21.265 1.388 20.599.896 19.848.527c-.715-.36-1.521-.545-2.753-.604C16.045.013 15.638 0 12.017 0zM12.017 2.162c3.556 0 3.97.013 5.369.072 1.294.059 1.996.274 2.464.456.619.24 1.061.526 1.527.992.466.466.752.908.992 1.527.182.468.397 1.17.456 2.464.059 1.399.072 1.813.072 5.369 0 3.556-.013 3.97-.072 5.369-.059 1.294-.274 1.996-.456 2.464a4.108 4.108 0 0 1-.992 1.527c-.466.466-.908.752-1.527.992-.468.182-1.17.397-2.464.456-1.399.059-1.813.072-5.369.072-3.556 0-3.97-.013-5.369-.072-1.294-.059-1.996-.274-2.464-.456a4.108 4.108 0 0 1-1.527-.992c-.466-.466-.752-.908-.992-1.527-.182-.468-.397-1.17-.456-2.464-.059-1.399-.072-1.813-.072-5.369 0-3.556.013-3.97.072-5.369.059-1.294.274-1.996.456-2.464.24-.619.526-1.061.992-1.527.466-.466.908-.752 1.527-.992.468-.182 1.17-.397 2.464-.456 1.399-.059 1.813-.072 5.369-.072z"/>
          <path d="M12.017 5.838a6.179 6.179 0 1 0 0 12.358 6.179 6.179 0 0 0 0-12.358zM12.017 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM19.846 5.595a1.441 1.441 0 1 1-2.883 0 1.441 1.441 0 0 1 2.883 0z"/>
        </svg>
      ),
      username: '@laxman_dev',
      url: 'https://instagram.com/laxman_dev',
      color: 'text-pink-600 bg-pink-50 hover:bg-pink-100'
    }
  ];

  const technicalSkills = [
    { name: 'JavaScript', level: 90, color: 'bg-yellow-400' },
    { name: 'React.js', level: 85, color: 'bg-blue-500' },
    { name: 'Node.js', level: 80, color: 'bg-green-500' },
    { name: 'Python', level: 75, color: 'bg-blue-600' },
    { name: 'MongoDB', level: 70, color: 'bg-green-600' },
    { name: 'MySQL', level: 85, color: 'bg-orange-500' },
    { name: 'HTML/CSS', level: 95, color: 'bg-red-500' },
    { name: 'Git', level: 80, color: 'bg-gray-600' }
  ];

  const softSkills = [
    'Problem Solving',
    'Team Leadership',
    'Communication',
    'Project Management',
    'Critical Thinking',
    'Adaptability'
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Social Media Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m-4-1v4m4-4v4m4-4v4m0-8V4a2 2 0 00-2-2H9a2 2 0 00-2 2v4" />
            </svg>
            Social Media Profiles
          </h2>
          
          <div className="grid-row-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            {socialAccounts.map((account, index) => (
              <a
                key={index}
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center mb-4 justify-between p-4 rounded-lg border-2 border-gray-100 transition-all duration-200 hover:border-gray-200 hover:shadow-md ${account.color}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {account.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{account.name}</p>
                    <p className="text-xs opacity-75">{account.username}</p>
                  </div>
                </div>
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Technical Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Technical Skills
            </h2>
            
            <div className="space-y-4">
              {technicalSkills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${skill.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Soft Skills
            </h2>
            
            <div className="grid grid-cols-1 gap-3">
              {softSkills.map((skill, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">{skill}</span>
                  <div className="ml-auto">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Let's Connect
          </h2>
          <p className="text-gray-600 text-sm">
            Feel free to reach out for collaborations, opportunities, or just to say hello!
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              laxman@example.com
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91 98765 43210
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialMedia;