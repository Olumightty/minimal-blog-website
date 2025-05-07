// drafts.js

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const draftsContainer = document.getElementById('draftsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchDrafts');
    const sortSelect = document.getElementById('sortDrafts');
    const totalDraftsElement = document.getElementById('totalDrafts');
    const recentDraftsElement = document.getElementById('recentDrafts');
    const modal = document.getElementById('draftPreviewModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalWordCount = document.getElementById('modalWordCount');
    const modalContent = document.getElementById('modalContent');
    const closeModalBtn = document.querySelector('.close-modal');
    const editDraftBtn = document.getElementById('editDraftBtn');
    const newDraftBtn = document.querySelector('.new-draft-btn');
    const createFirstDraftBtn = document.querySelector('.create-first-draft-btn');
  
    // State
    let drafts = [];
    let filteredDrafts = [];
    let currentPage = 1;
    const draftsPerPage = 12;
    
    // Fetch drafts from server
    fetchDrafts();
  
    // Event Listeners
    searchInput.addEventListener('input', handleSearch);
    sortSelect.addEventListener('change', handleSort);
    closeModalBtn.addEventListener('click', closeModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    editDraftBtn.addEventListener('click', handleEditDraft);
    newDraftBtn.addEventListener('click', createNewDraft);
    createFirstDraftBtn.addEventListener('click', createNewDraft);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  
    // Functions
    function fetchDrafts() {
      // Simulate API call to fetch drafts
      // In real app, replace with actual fetch call to your backend
      setTimeout(() => {
        // Mock data - replace with actual API call
        drafts = generateMockDrafts();
        
        // Update stats
        updateDraftStats();
        
        // Display drafts
        filteredDrafts = [...drafts];
        renderDrafts();
      }, 800); // Simulate network delay
    }
  
    function generateMockDrafts() {
      // Mock data for development purposes
      // You'll replace this with actual data from your backend
      const mockDrafts = [
        {
          id: '1',
          title: 'The Impact of AI on Modern Journalism',
          excerpt: 'Artificial intelligence is reshaping how news is gathered, produced, and distributed. This article explores the ethical implications and future trends of AI in journalism.',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dignissim, justo eget ultricies sodales, elit ipsum eleifend eros, vel faucibus magna neque vel purus. Aenean sit amet eleifend ipsum. Praesent non faucibus leo, a gravida est. Cras sodales justo nibh, non vehicula nisi semper id. Cras bibendum nisl velit, consequat ultricies elit rutrum et. Integer mattis mi in elit interdum, nec eleifend purus aliquam. Morbi ac diam vitae ligula vehicula malesuada sit amet at magna. Aliquam placerat ac sapien vitae luctus. Aenean lorem eros, tincidunt ac ultrices vel, aliquam a elit. Sed vulputate iaculis tempus. Donec porttitor ex at risus interdum pellentesque ut quis sem. Maecenas vestibulum orci ut eros porttitor accumsan.',
          lastEdited: '2025-05-02T14:30:00',
          wordCount: 425
        },
        {
          id: '2',
          title: 'Sustainable Living in Urban Environments',
          excerpt: 'Exploring practical ways to reduce your environmental footprint while living in a city. From zero-waste shopping to energy conservation in small apartments.',
          content: 'Aenean at nulla nec sem faucibus condimentum. Nulla mollis nisl ipsum, at dapibus felis finibus quis. Maecenas sodales ipsum mi, ac pulvinar magna placerat nec. Suspendisse varius, nulla id mattis pharetra, est augue aliquet orci, ut tincidunt nisl ipsum a arcu. Quisque nec ullamcorper sem, ut viverra eros. Phasellus at est ut eros porta congue et ac orci. Cras a diam dui. Phasellus ut ipsum sit amet mauris vehicula mattis. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
          lastEdited: '2025-05-04T09:15:00',
          wordCount: 310
        },
        {
          id: '3',
          title: 'The Evolution of Programming Languages',
          excerpt: 'A comprehensive look at how programming languages have evolved over the decades and what trends are shaping their future development.',
          content: 'Praesent sagittis nisi at feugiat congue. Morbi ornare augue ac faucibus varius. Nulla facilisi. Etiam rutrum dictum erat vel consectetur. Proin sodales enim vel nisl consequat, sed pharetra nisi aliquet. Aenean eget urna id eros tempus posuere. Integer vitae sodales ipsum. Mauris purus magna, congue eu tellus vel, finibus sagittis enim. Cras sit amet arcu vestibulum, commodo risus vitae, efficitur massa. Donec sed tellus at magna tristique hendrerit ut sed nibh. Phasellus blandit ut neque a dignissim. Nam eu sem tellus. Ut id ex vestibulum, semper turpis non, ultrices purus. Suspendisse potenti.',
          lastEdited: '2025-05-01T16:45:00',
          wordCount: 518
        },
        {
          id: '4',
          title: 'Travel Guide: Hidden Gems of Southeast Asia',
          excerpt: 'Discover lesser-known destinations across Southeast Asia that offer authentic cultural experiences without the crowds of typical tourist spots.',
          content: 'Donec non lacus venenatis, faucibus eros a, tincidunt quam. Vestibulum imperdiet mi nec porta ultrices. Nulla eget ex id massa porta posuere. Cras in molestie risus, nec fringilla magna. Morbi a porta nulla. Vestibulum vestibulum, massa in efficitur lobortis, lorem justo varius turpis, sed sodales mauris odio vel nunc. Phasellus a ullamcorper risus. Nunc imperdiet lectus nec velit lacinia, nec vulputate massa vestibulum. Praesent ac sapien ac tellus facilisis feugiat. Integer condimentum magna in purus tristique, nec mattis tellus aliquet. Donec blandit, enim non pretium molestie, ligula est varius massa, vel commodo dui justo non nibh.',
          lastEdited: '2025-05-05T11:20:00',
          wordCount: 275
        },
        {
          id: '5',
          title: 'The Psychology of Decision Making',
          excerpt: 'Understanding the cognitive biases and mental shortcuts that influence our daily decisions and how to make more rational choices.',
          content: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec id sapien eget risus pellentesque malesuada. Proin aliquet cursus lorem, id porttitor nisl tincidunt et. Donec fermentum ante nec pulvinar varius. Integer pretium ac ipsum ut gravida. Nullam eros mauris, laoreet quis vehicula ut, fermentum sed lacus. Quisque rutrum neque nec dolor pharetra varius. Mauris sagittis neque eu nisi vestibulum consequat. Suspendisse potenti. Suspendisse nec massa eget nisl facilisis sodales eu nec libero. Mauris quis luctus massa.',
          lastEdited: '2025-04-28T15:10:00',
          wordCount: 382
        }
      ];
      
      return mockDrafts;
    }
  
    function renderDrafts() {
      // Clear loading indicator
      draftsContainer.innerHTML = '';
      
      // Check if we have drafts to display
      if (filteredDrafts.length === 0) {
        emptyState.style.display = 'block';
        return;
      }
      
      emptyState.style.display = 'none';
      
      // Calculate pagination
      const startIndex = (currentPage - 1) * draftsPerPage;
      const endIndex = startIndex + draftsPerPage;
      const paginatedDrafts = filteredDrafts.slice(startIndex, endIndex);
      
      // Create draft cards
      paginatedDrafts.forEach(draft => {
        const draftCard = createDraftCard(draft);
        draftsContainer.appendChild(draftCard);
      });
      
      // Render pagination if needed
      renderPagination();
    }
    
    function createDraftCard(draft) {
      const card = document.createElement('div');
      card.className = 'draft-card';
      card.dataset.id = draft.id;
      
      // Format date
      const lastEdited = new Date(draft.lastEdited);
      const formattedDate = lastEdited.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      card.innerHTML = `
        <div class="draft-card-header">
          <h3 class="draft-title">${draft.title}</h3>
        </div>
        <div class="draft-card-body">
          <p class="draft-excerpt">${draft.excerpt}</p>
        </div>
        <div class="draft-card-footer">
          <span class="draft-date">${formattedDate}</span>
          <span class="draft-word-count">${draft.wordCount} words</span>
        </div>
      `;
      
      // Add click event to open preview modal
      card.addEventListener('click', () => {
        openDraftPreview(draft);
      });
      
      return card;
    }
    
    function renderPagination() {
      const paginationElement = document.getElementById('pagination');
      paginationElement.innerHTML = '';
      
      const totalPages = Math.ceil(filteredDrafts.length / draftsPerPage);
      
      if (totalPages <= 1) {
        return; // Don't show pagination if only one page
      }
      
      // Previous button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'pagination-btn prev';
      prevBtn.innerHTML = '&laquo;';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderDrafts();
        }
      });
      paginationElement.appendChild(prevBtn);
      
      // Page buttons
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${currentPage === i ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
          currentPage = i;
          renderDrafts();
        });
        paginationElement.appendChild(pageBtn);
      }
      
      // Next button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'pagination-btn next';
      nextBtn.innerHTML = '&raquo;';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderDrafts();
        }
      });
      paginationElement.appendChild(nextBtn);
    }
    
    function updateDraftStats() {
      // Update total drafts count
      totalDraftsElement.textContent = drafts.length;
      
      // Calculate drafts created this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentDraftsCount = drafts.filter(draft => {
        const draftDate = new Date(draft.lastEdited);
        return draftDate > oneWeekAgo;
      }).length;
      
      recentDraftsElement.textContent = recentDraftsCount;
    }
    
    function handleSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      if (searchTerm === '') {
        filteredDrafts = [...drafts];
      } else {
        filteredDrafts = drafts.filter(draft => {
          return draft.title.toLowerCase().includes(searchTerm) || 
                 draft.excerpt.toLowerCase().includes(searchTerm) ||
                 draft.content.toLowerCase().includes(searchTerm);
        });
      }
      
      currentPage = 1; // Reset to first page
      renderDrafts();
    }
    
    function handleSort() {
      const sortValue = sortSelect.value;
      
      switch (sortValue) {
        case 'recent':
          filteredDrafts.sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited));
          break;
        case 'oldest':
          filteredDrafts.sort((a, b) => new Date(a.lastEdited) - new Date(b.lastEdited));
          break;
        case 'title':
          filteredDrafts.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
      
      renderDrafts();
    }
    
    function openDraftPreview(draft) {
      // Set modal content
      modalTitle.textContent = draft.title;
      
      const lastEdited = new Date(draft.lastEdited);
      modalDate.textContent = `Last edited: ${lastEdited.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;
      
      modalWordCount.textContent = `${draft.wordCount} words`;
      modalContent.textContent = draft.content;
      
      // Store draft ID for edit action
      editDraftBtn.dataset.id = draft.id;
      
      // Show modal
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    }
    
    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }
    
    function handleEditDraft() {
      const draftId = editDraftBtn.dataset.id;
      // Redirect to edit page
      window.location.href = `/drafts/edit/${draftId}`;
    }
    
    function createNewDraft() {
      // Redirect to new draft page
      window.location.href = '/drafts/new';
    }
  });